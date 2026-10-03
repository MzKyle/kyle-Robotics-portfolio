In weld-pool vision for robotic weave welding, the periodic arm motion shifts the imaging viewpoint and constrains stable observation of the weld pool. Traditional per-frame motion compensation is limited by the 60 Hz TCP state output of closed industrial robot platforms such as FANUC: temporal resolution is severely mismatched, and interpolated high-rate trajectories lack sufficient credibility. This article proposes a **system architecture redesign based on motion priors and post-selection ISP**. Decomposing arm motion into a slowly varying seam-following component and a known periodic weaving component **reduces full-trajectory reconstruction to key-phase time estimation**. It then **converts spatial image compensation into temporal phase-based frame selection**. Decoupling RAW capture from ISP allows the sensor to continuously acquire RAW at 200 Hz temporal resolution, while full ISP is applied only to the few frames matching key weave phases, producing stable, same-phase weld-pool observations.

---
## 1. The source of the problem: temporal-resolution mismatch between robot and vision
The central contradiction in robotic weave-welding vision is a **systematic mismatch among robot motion state, visual sampling rate, and time-synchronization accuracy**.

The industrial camera is rigidly attached near the robot's end flange and follows the TCP (Tool Center Point) through the weaving motion. From the observer's perspective, target motion in the image contains two coupled components:
- The weld pool's own position: the actual signal to observe.
- The camera viewpoint shift caused by TCP weaving: the disturbance component.

The goal is to remove the influence of the latter and obtain a stable weld-pool observation sequence.

### 1.1 The traditional per-frame compensation path
The intuitive response to this motion disturbance is per-frame compensation based on multi-source state fusion:
1. Read robot TCP pose and the weld-pool position detected by vision in real time.
2. Fuse these states using a Kalman filter to estimate the weld pool's actual spatial position.
3. Apply an inverse geometric transformation to every image frame to compensate for camera motion.

This can be feasible in an open servo system, but on closed industrial robot platforms such as FANUC it encounters a hard constraint in the underlying interface.

### 1.2 The hard constraint: a 60 Hz robot TCP sampling ceiling
FANUC's external controller interface is relatively closed and does not provide direct access to kHz-level servo-loop motion state as an open servo system would. In the project, `tool_pos` data was read through a reverse-engineered TCP communication protocol. Its effective update rate was only about 60 Hz, corresponding to a sample interval of:
$$ \Delta t_{robot} \approx \frac{1}{60} \approx 16.7\ \text{ms} $$

A 60 Hz rate is sufficient for ordinary robot status monitoring, but its temporal granularity is substantially different from that of the camera in high-rate visual stabilization:
- Camera imaging can reach 120–200 Hz, with sample intervals of 5–8.3 ms.
- Robot TCP state is only 60 Hz, with sample intervals of 16.7 ms.

The difference is illustrated by:
> Camera samples: ●--●--●--●--●--●--●--●
> Robot samples: ●---------●---------●

Upsampling the 60 Hz TCP sequence by interpolation and using it in per-frame Kalman fusion amounts to **reconstructing unknown high-frequency motion from low-frequency samples**. Interpolation cannot create additional observation information. Sampling-theorem constraints ultimately limit compensation accuracy, explaining why the Kalman approach performed poorly.

---
## 2. Motion priors: the decomposability of robot weaving
The premise for moving beyond sparse sampling is that **robot weaving is controlled motion with strong structural priors, rather than an entirely unknown random disturbance**.

During weave welding, overall TCP motion can be decomposed into components with different time scales and properties. In the local seam coordinate frame:
$$ p_{TCP}(t) = p_{seam}(t) + p_{weave}(t) $$

> This is an engineering decomposition of TCP translation in the local seam frame, not a strict vector addition of six-degree-of-freedom rigid-body motion. It applies to typical welding situations where weave amplitude is much smaller than seam length.

### 2.1 Seam following: a slowly varying unknown component
$p_{seam}(t)$ represents overall motion along the seam and the visual correction component, including:
- Continuous feed along the seam.
- Left-right correction perpendicular to the seam.
- Up-down arc-voltage correction in the height direction.

This component **changes slowly, has no fixed period, and must be estimated from observations in real time**. It is the system's unknown slow signal.

### 2.2 Weaving: a known structural component
$p_{weave}(t)$ is the periodic motion executed by the controller according to preset welding parameters. It is an actively commanded control output with prior information:
- **Known period**: weave frequency is preset by the welding process.
- **Known or configurable amplitude**: weave width is preset according to seam width.
- **Known trajectory form**: commonly sinusoidal, triangular, sawtooth, or crescent-shaped.
- **Continuous phase**: the arm's servo motion is continuous; its phase does not jump abruptly.

> Process background: weaving is common in thick-plate welding. Periodic torch motion perpendicular to the seam increases the heated weld-pool area, improves sidewall fusion, and reduces welding defects. Weave parameters are normally determined from plate thickness and groove form before welding and remain stable during the operation.

This decomposition is the foundation of the design. Instead of reconstructing every high-frequency movement from 60 Hz samples, measured TCP data can constrain the known weave model to estimate key motion states with greater precision.

---
## 3. Problem reduction: from full trajectories to key-phase event times
Once the motion prior is established, the first reduction becomes possible. Rather than reconstructing a complete high-precision TCP trajectory at 1 kHz, the task is to estimate timestamps for key weaving phases accurately.

### 3.1 Defining key phases
The most useful phase events for weld-pool stabilization include:
- Left and right weave extrema, satisfying $\frac{dx_{weave}}{dt}=0$.
- Any fixed target phase, $\phi(t)=\phi_{target}$.

Finding the corresponding time $t_{peak}$ in each cycle provides the basis for image selection.

### 3.2 What supports the estimate's credibility
Estimating a key phase time from 60 Hz TCP data is **model-based estimation under multiple constraints**, rather than unsupported interpolation. Its credibility comes from:
1. **Weave-model constraints**: trajectory form, period, and amplitude range are known.
2. **Motion continuity**: the arm's rigid-body velocity and acceleration are continuous.
3. **Fitting multiple observations**: several consecutive TCP samples before and after the event constrain the trajectory together, rather than relying on a single point.
4. **A slow-component assumption**: seam-following motion changes little within one weave cycle and can be approximated by a linear trend.

The reasoning is: real low-rate observations + a known motion model + continuity constraints → an estimate of key motion-phase timing. This has a different basis for credibility from simple low-rate interpolation and upsampling.

### 3.3 Why not use per-frame Kalman fusion
**A useful estimate of key-phase time** does not imply that full-precision high-rate TCP state is available for per-frame compensation.

**Per-frame motion compensation places demanding requirements on state estimation**: TCP position, velocity, and timing delay must **all be highly accurate at every instant**. A weave model cannot fully remove servo tracking error, mechanical vibration, communication-delay jitter, or other nonideal effects. Key-phase estimation only needs the timing of a characteristic event; its constraints are stronger and its solution is substantially simpler.

Under the 60 Hz TCP hardware constraint, focusing on key-phase time rather than full-state per-frame fusion is a better fit for the available information.

---
## 4. Changing the approach: from spatial compensation to temporal phase selection
Key-phase estimation enables the second restructuring: **per-frame image compensation in the spatial domain** becomes **same-phase frame selection in the temporal domain**.

### 4.1 How phase selection stabilizes observations
Weaving is highly periodic and repeatable. Instead of applying inverse motion compensation to every image, **select a frame from each cycle when the robot is at the same motion phase**.

With a fixed sampling phase:
- The TCP weave displacement is approximately the same.
- Camera position and viewing angle are approximately consistent.
- The weld pool's relative position in the image is approximately stable.

This extracts a key-frame sequence with consistent spatial state from a continuously oscillating image stream:
![Phase-based key-frame extraction](https://i-blog.csdnimg.cn/direct/db125dd58305489496e216f39efe5997.png =650x)

This is **temporal stabilization based on motion phase**, distinct from conventional electronic image stabilization (EIS). It does not geometrically transform or interpolate the image, avoiding distortion and feature-matching errors introduced by that processing. It is especially suitable for low-texture, highly dynamic weld-pool scenes.

### 4.2 The new bottleneck: camera temporal sampling resolution
Once phase-based frame selection is used, the central bottleneck moves from robot state rate to the temporal sampling resolution of camera RAW data.

The robot supplies a key-phase timestamp $t_{peak}$; the camera must select the frame closest to it in the continuously acquired stream:
$$ k^* = \arg\min_k |t_k - t_{peak}| $$

Phase-matching error is strongly influenced by the camera's sampling granularity. Higher temporal resolution produces denser candidate frames and a smaller matching error.

For example:
- At 120 Hz, the interval is about 8.33 ms and the ideal maximum quantization error is about 4.17 ms.
- At 200 Hz, the interval is 5 ms and the ideal maximum quantization error is 2.5 ms.

This rate increase reduces the maximum temporal quantization error by about 40%. From $\Delta x \approx v \cdot \Delta t$, time error translates linearly into position error; RAW temporal resolution therefore directly influences stabilization precision.

> The purpose of 200 Hz is not to output a 200 FPS visualization video. It is to obtain 200 Hz temporal sampling capability for more precise matching to a key-phase event.

---
## 5. Architecture redesign: post-selection ISP and decoupled capture and imaging
The main obstacle to increasing RAW temporal sampling rate is ISP's position and processing capacity in a traditional camera pipeline.

### 5.1 The traditional imaging bottleneck
The traditional industrial-camera path is serial:
$$ \text{Sensor} \rightarrow \text{RAW} \rightarrow \text{ISP} \rightarrow \text{Final image} \rightarrow \text{Host} $$

The image signal processor performs a full image-quality pipeline, commonly including:
- Black level correction.
- Bad pixel correction.
- Gain and exposure adjustment.
- Demosaicing.
- Gamma correction and tone mapping.
- Color correction.
- Image enhancement such as denoising and sharpening.

Full ISP is computationally expensive. Even when sensor RAW readout can reach 200 Hz, the complete ISP path may support only 120 Hz image output. ISP then becomes a bottleneck in high-temporal-resolution acquisition, beyond its image-quality role.
> For a detailed explanation of ISP, see the author's ISP article series.
### 5.2 The solution: decouple capture from imaging
The traditional architecture implicitly assumes that every captured RAW frame must immediately become a final image. In phase-based selection, however, most RAW frames are never used; only the few near a key phase have imaging value.

A more suitable architecture is **capture first, select next, process last**, separating RAW acquisition from ISP:
1. **Full-rate RAW capture**: the sensor continuously acquires RAW near its maximum 200 Hz rate, stores it in a RAW buffer, and attaches a precise timestamp to every frame.
2. **Key-frame time matching**: use the robot's $t_{peak}$ to find the closest key RAW frame in the buffer.
3. **On-demand ISP**: execute the complete ISP pipeline only for selected RAW frames and output the final weld-pool image.

### 5.3 Post-selection ISP
**Remove ISP from the critical path of RAW acquisition**.

- Traditional architecture: ISP determines maximum imaging rate, limiting RAW capture.
- Redesigned architecture: sensor readout determines RAW capture rate; ISP processes only the few selected frames.

This restructuring provides two benefits:
- **High-temporal-resolution sampling**: the sensor can use its 200 Hz RAW readout capability for precise phase matching.
- **Lower computation load**: ISP handles only the selected fraction of frames, such as five frames per second for a 5 Hz weave when one frame is selected per cycle, releasing substantial compute resources.

---
## 6. Coordinating two timelines: robot and camera workflow

The system consists of a robot-state timeline and a camera-acquisition timeline operating in parallel. They need not use the same sampling rate. Instead, timestamps on a common time base relate low-rate robot state to high-rate images.

The central idea is:
**Use low-rate TCP observations and the periodic weave prior to estimate a target-phase event time, then select the nearest real sampled frame from the high-rate RAW image stream.**

### 6.1 Robot side: from low-rate TCP observations to phase events

The FANUC robot outputs TCP pose at about 60 Hz. Because this is substantially lower than the camera rate, the robot-side objective is to estimate or predict the event time $t_{phase}$ from limited observations and motion priors, rather than supply a precise pose for every frame.

The workflow is:
**TCP state acquisition**
Read FANUC `tool_pos` at about 60 Hz to obtain a discrete pose sequence:
$$
\mathbf{p}(t_k),\qquad t_k=kT_r
$$
The robot sample interval is approximately:
$$
T_r \approx \frac{1}{60}\approx16.7\text{ ms}
$$

**Separate the motion trend**
TCP motion can be approximated as the sum of welding advance and periodic weaving:
$$
\mathbf{p}*{TCP}(t) = \mathbf{p}*{seam}(t) + \mathbf{p}_{weave}(t)
$$
Here:

- $\mathbf{p}_{seam}(t)$ is the slow motion component along the seam.
- $\mathbf{p}_{weave}(t)$ is the strongly periodic weaving component.

Detrending, local fitting, or projection onto the known weaving direction can strengthen the periodic motion feature.

**Estimate local trajectory and phase**
Use a recent window of TCP observations together with period, amplitude, and motion continuity to estimate the local weave state.
For example, a periodic model is:
$$
x_{weave}(t) = A\sin(\omega t+\phi)
$$
Alternatively, fit a local quadratic near an extremum.

This fit does not elevate actual robot state to 200 Hz. It uses the motion model to estimate the approximate event time between two 60 Hz observations.

**Estimate key-phase time**
Define the desired phase, for example:

- Left extremum.
- Right extremum.
- Center zero crossing.
- A fixed weaving phase.

For an extremum, solve:
$$
\frac{dx_{weave}(t)}{dt}=0
$$
to obtain $t_{phase}$.
Because $t_{phase}$ comes from sparse 60 Hz observations and a model, it is an event-time estimate with uncertainty. Its **accuracy is jointly influenced by TCP sample interval, communication jitter, timestamp error, and weave-model error**.

**Predict the next cycle's phase**
When the weave period $T_w$ is stable, a detected event can predict the next same-phase event:
$$
\hat t_{phase}^{(n+1)} = t_{phase}^{(n)} + T_w
$$

The system can thus progress from finding an image after an event occurs to predicting the next event in advance, supporting a more stable camera-side selection mechanism.

### 6.2 Camera side: from high-rate RAW samples to same-phase key frames

The camera and robot sample at different rates.
Assuming continuous 200 Hz RAW capture, the camera interval is:
$$
T_c=\frac{1}{200}=5\text{ ms}
$$

The camera does not wait for robot state before triggering acquisition. It continuously samples at high rate to preserve temporal resolution.

Its workflow is:
**Continuous RAW capture**
The sensor continuously outputs RAW at about 200 Hz:
$$
I_{RAW}(t_0),I_{RAW}(t_1),I_{RAW}(t_2),\ldots
$$
Every frame records its acquisition timestamp $t_i^{cam}$.
That timestamp should be as close to the actual exposure as possible, rather than merely the subsequent ROS callback or ISP completion time.

**RAW history buffer**
Maintain a rolling history buffer, such as:
$$
\mathcal B = { (I_i,t_i^{cam}) }
$$
Only recent RAW frames are retained; new frames are written continuously and expired ones discarded.
Even if robot-side phase detection takes several milliseconds, the camera can retrieve an actual historical RAW frame near the estimated event.
> Implementation: Multi-Chunk + Ring Buffer. Each chunk contains several complete RAW frames; multiple chunks are reused in a ring.
> Logical window: the most recent 200–250 ms.
> Physical capacity: 64 frames.
> The target is to retain more than 200 ms of data. The actual 64-frame storage provides margin for system jitter and improves storage-layout efficiency. Multiple chunks absorb instantaneous algorithm-processing delays; the ring buffer provides bounded, continuously reused long-term storage.


**Common time base**
Accurate matching between robot TCP state and camera RAW requires the estimated phase time $t_{phase}$ and camera acquisition time $t_i^{cam}$ to share a common or corrected time base:
$$
t^{robot}\longleftrightarrow t^{camera}
$$

Ideally, PTP, hardware triggering, or a shared hardware clock could synchronize the robot and camera precisely. Actual device interfaces and development conditions did not allow a hardware-level common clock, so the system used **software time alignment based on internal device counters**.

At initialization, record the camera and FANUC internal counters together to establish a synchronization anchor:
$$
C_{cam}^{0} \longleftrightarrow C_{robot}^{0} \longleftrightarrow t_{sync}
$$
Here $C_{cam}^{0}$ and $C_{robot}^{0}$ are the respective counter values at synchronization; $t_{sync}$ is the industrial PC's common reference time.

Subsequent camera frames and TCP data carry their own device counts. After reaching the ROS processing node, the initial synchronization relationship converts those counts to a common software timeline, recovering their acquisition or state time:
$$
C_{device} \rightarrow t_{device} \rightarrow t_{common}
$$

This limits contamination of original measurement time by network transmission, ROS scheduling, and thread-execution delays, and provides a common time basis for:
$$
\arg\min_i \left| t_i^{cam}-t_{phase} \right|
$$
cross-system key-frame matching.

**Clock drift during long operation**
Continuous-operation tests found that after about a week, the camera-to-FANUC count relationship gradually shifted. Recovered timestamps for the same physical instant no longer aligned accurately.

The main cause was a difference between the devices' internal hardware-clock frequencies. Even when clocks agree at initialization, a small oscillator-frequency error accumulates with operating time:
$$
\Delta t_{clock}(t) = t^{camera}(t)-t^{robot}(t)
$$

Ideally:
$$
\Delta t_{clock}(t)\approx0
$$
But actual devices commonly have:
$$
f_{camera}\neq f_{robot}
$$
So, as operating time increases:
$$
|\Delta t_{clock}(t)| \uparrow
$$

A single synchronization corrects the initial clock offset but cannot eliminate long-term drift caused by unequal clock rates.

The task-management module therefore gained a **periodic resynchronization mechanism**. Every day, an idle window that does not disrupt acquisition is used to reread both device counters and establish a new anchor:
$$
C_{cam}^{k} \longleftrightarrow C_{robot}^{k} \longleftrightarrow t_{sync}^{k}
$$

Periodically recalibrating the mapping between local clocks constrains accumulated long-term drift to an acceptable range.

The implemented timing workflow is:
```mermaid
clock-mapping
```

This is software-level time calibration and drift compensation. Its final accuracy is still affected by counter resolution, oscillator stability, synchronization-operation delay, and software scheduling jitter. The design does not establish a strict hard-real-time global clock. It keeps phase-event time and RAW capture time stably related under the available hardware conditions so that key-frame selection and weld-pool stabilization can work.


**Key-frame time matching**
After obtaining $t_{phase}$, find the actual RAW sample with the smallest time distance:
$$
i^* = \arg\min_i \left| t_i^{cam}-t_{phase} \right|
$$
The selected RAW frame is:
$$
I_{key} = I_{RAW}(t_{i^*})
$$

For a 200 Hz camera, under ideal conditions without additional synchronization error, nearest-neighbor quantization from discrete frame sampling alone is bounded by:
$$
\pm\frac{T_c}{2} = \pm2.5\text{ ms}
$$
Actual total error also includes robot phase-estimation error, clock-synchronization error, and error in the definition of exposure time.

**Key-frame ISP post-processing**
Execute complete ISP on the selected key RAW frame:
$$
I_{RAW} \xrightarrow{ISP} I_{RGB}
$$
This includes black-level correction, bad-pixel removal, demosaicing, white balance, color correction, gamma, denoising, and enhancement.

Compared with applying full ISP to every frame, computation is concentrated on the key frames that are actually needed:
$$
\text{High-rate RAW capture} + \text{Low-rate key-frame ISP}
$$

**Output a same-phase image sequence**
Applying the same phase-selection procedure across consecutive cycles produces:
$$
I_{key}^{(1)}, I_{key}^{(2)}, I_{key}^{(3)}, \ldots
$$
Although the images come from different cycles, they correspond to approximately the same motion phase, making the camera's instantaneous viewing state relative to the weld pool more consistent.

This extracts a phase-consistent key-frame sequence from the continuously oscillating stream:

![Same-phase sequence across cycles](https://i-blog.csdnimg.cn/direct/28b75a6d77fc4ee3b7c95c3483dd7d46.png =650x)


The strong periodic image motion caused by robot weaving can therefore be substantially suppressed in the output sequence.

### 6.3 Overall system architecture

The final system has two parallel timelines with different rates but a shared time base:

```mermaid
dual-timeline
```

At the system level, this architecture **converts spatial compensation into temporal selection**:
$$
\boxed{ \text{Estimate robot motion per frame and compensate images spatially} }
$$
becomes:
$$
\boxed{ \text{Estimate key motion phase} + \text{Select same-phase frames from a real high-rate image stream} }
$$

This avoids relying on sparse FANUC TCP data to reconstruct high-rate robot motion for every frame, while using the camera's own 200 Hz temporal resolution.

What the system increases is image sampling resolution, not robot state measurement rate:
$$
\boxed{ 60\text{ Hz Robot State} \quad+\quad 200\text{ Hz RAW Sampling} \quad+\quad \text{Phase Estimation} \quad\Rightarrow\quad \text{Phase-consistent Image Sequence} }
$$

The value is therefore not in interpolating 60 Hz robot data into 200 Hz, but in:

**Letting low-rate robot state decide when it is worth looking, and letting the high-rate camera ensure that a real image was captured at that moment.**

---

## 7. Error analysis and the path of evolution
The current design is an engineering solution optimized for specific hardware constraints. It retains several error sources and can evolve as hardware improves.

### 7.1 Error sources in the current design
Phase-matching and imaging error combine multiple factors:
$$ e_{total} = e_{robot} + e_{model} + e_{comm} + e_{sync} + e_{camera} $$
- $e_{robot}$: quantization and data delay from 60 Hz TCP sampling.
- $e_{model}$: differences between the mathematical weave model and actual servo execution.
- $e_{comm}$: robot-to-host communication delay and jitter.
- $e_{sync}$: clock-synchronization error between controller and camera.
- $e_{camera}$: RAW temporal quantization and exposure-time offset.

### 7.2 Future evolution
With upgraded hardware interfaces, the architecture can move toward precise per-frame compensation:
1. **High-rate servo state**: access to 500 Hz–1 kHz servo-loop state would support high-precision TCP trajectory estimation over the full timeline.
2. **Precise clock synchronization**: PTP (Precision Time Protocol, IEEE 1588) could provide sub-microsecond robot–camera synchronization and eliminate synchronization error.
3. **Per-frame state fusion**: high-rate robot state and visual observations could be fused by a Kalman filter or state observer, enabling full-rate motion compensation and stable images.

The system could then progress from phase-selected stabilization to full-rate fused stabilization, with greater observation freedom and precision.

---

## 8. Reflection: system design under hardware constraints
Looking back, the most valuable part is the system-design reasoning under hardware constraints, rather than any one algorithm.

### 8.1 Move beyond parameter tuning: investigate the constraints below
When per-frame Kalman fusion performs poorly, the immediate response is often to tune parameters or use a more complex algorithm. The real cause here was insufficient information from the hardware interface: 60 Hz TCP sampling cannot support reconstruction of all high-frequency motion. Optimizing algorithms along a hardware-limited path becomes **parameter tuning without a fundamental improvement**.

### 8.2 Use domain priors: redefine the problem boundary
Industrial scenarios offer extensive domain knowledge. Weaving is an actively commanded structural control output, not random disturbance. Decomposing motion turns unknown high-frequency motion into a known model plus slow offset, substantially narrowing the solution space.

### 8.3 Reduce the problem: spatial compensation becomes temporal selection
Replacing spatial image compensation with temporal key-frame selection is a characteristic reduction. It gives up the universal objective of stabilizing every frame and uses periodicity to select one stable frame per cycle, satisfying the core observation need with less information.

### 8.4 Restructure the architecture: decouple acquisition and processing
Post-selection ISP changes the architecture by breaking the assumption that capture implies immediate processing. It separates information acquisition from value generation. The sensor records the physical world at fine temporal granularity; the system identifies valuable moments first and then spends compute on their images. This reasoning is broadly applicable to industrial vision and high-speed inspection.

---
## Conclusion
For FANUC weave-welding weld-pool vision, this article proposes a system architecture based on motion priors and post-selection ISP. Under the 60 Hz TCP hardware constraint, it does not force further optimization of per-frame fusion. Instead, motion decomposition, problem reduction, and architecture redesign convert the task into key-phase time estimation and high-rate RAW selection, achieving stable weld-pool observations.

Industrial vision optimization should go beyond algorithm parameter tuning: combine process-specific priors above with a detailed understanding of hardware constraints below. Redefining the problem and restructuring the architecture can make the best use of limited hardware.
