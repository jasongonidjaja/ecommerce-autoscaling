# Hybrid Predictive-Reactive Autoscaling for Kubernetes

This repository contains the implementation of a Kubernetes-based e-commerce application developed to support research on **Hybrid Predictive-Reactive Autoscaling under simulated Mega Sale workloads**.

The research evaluates reactive, predictive, and hybrid autoscaling mechanisms under different workload conditions in a Kubernetes environment.

---

## Table of Contents

- [Research Objective](#research-objective)
- [Research Architecture](#research-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [E-Commerce Application](#e-commerce-application)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring](#monitoring)
- [Workload Generation](#workload-generation)
- [Autoscaling Configurations](#autoscaling-configurations)
- [Experimental Evaluation](#experimental-evaluation)
- [Experimental Data](#experimental-data)
- [Development Environment](#development-environment)
- [Installation](#installation)
- [Running the Backend Locally](#running-the-backend-locally)
- [Docker](#docker)
- [Deploying to Kubernetes](#deploying-to-kubernetes)
- [Research Status](#research-status)
- [Research References](#research-references)
- [Repository](#repository)
- [Citation](#citation)
- [License](#license)

---

## Research Objective

The objective of this research is to evaluate the behavior of a **Hybrid Predictive-Reactive Autoscaling** mechanism for a Kubernetes-based e-commerce application under simulated Mega Sale workloads.

Three autoscaling configurations are evaluated:

1. **Reactive Autoscaling** using Kubernetes Horizontal Pod Autoscaler (HPA)
2. **Predictive Autoscaling** using CPU utilization forecasting
3. **Hybrid Predictive-Reactive Autoscaling** combining predictive scaling with Kubernetes HPA

---

## Research Architecture

The overall experimental workflow is illustrated below:

```text
JMeter Workload
       |
       v
E-Commerce Application
       |
       v
CPU Utilization
       |
       v
Prometheus
       |
       v
CPU Time-Series Dataset
       |
       v
Fremer Forecasting Model
       |
       v
Predicted CPU Utilization
       |
       v
Proactive Scaling ---> Kubernetes Pods <--- Reactive Scaling <--- HPA
```

- **Apache JMeter** is used to generate HTTP requests representing different e-commerce workload conditions.
- **Prometheus** is used to collect time-series monitoring data from the Kubernetes environment. CPU utilization is used as the primary time-series input for forecasting, while other metrics are used for performance and autoscaling evaluation.
- **Fremer**, a frequency-domain Transformer model for workload forecasting in cloud services, is used in the forecasting stage.
- **Kubernetes HPA** provides the reactive scaling mechanism, while the proposed hybrid mechanism combines predictive and reactive scaling.

---

## Technology Stack

| Category            | Technology                    |
| ------------------- | ----------------------------- |
| Application         | Node.js, Express.js, MySQL, REST API |
| Containerization    | Docker                        |
| Orchestration       | Kubernetes                    |
| Monitoring          | Prometheus                    |
| Workload Generation | Apache JMeter                 |
| Forecasting         | Fremer                        |

---

## Project Structure

```text
ecommerce-autoscaling/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── productController.js
│   │   │   └── orderController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── productRoutes.js
│   │   │   └── orderRoutes.js
│   │   │
│   │   └── server.js
│   │
│   ├── k8s/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── autoscaling_event_20260929.csv
│
├── .gitignore
├── README.md
└── ...
```

---

## E-Commerce Application

The project includes a lightweight e-commerce backend designed to represent a transaction-oriented web application.

The application provides the following functionality:

- Product retrieval
- Mega Sale product retrieval
- Order processing

The application uses MySQL as the database and is deployed as a containerized application on Kubernetes.

The application is intentionally lightweight so that its behavior can be observed under controlled workload conditions during the autoscaling experiments.

---

## Kubernetes Deployment

The application is containerized using Docker and deployed to Kubernetes. The Kubernetes configuration files are located in `backend/k8s/`.

The deployment consists of:

- Kubernetes Deployment
- Kubernetes Service
- Horizontal Pod Autoscaler (HPA)

### Resource Configuration

The application Pods are configured with CPU and memory requests and limits to provide a controlled environment for autoscaling experiments.

| Resource | Request | Limit   |
| -------- | ------- | ------- |
| CPU      | `100m`  | `500m`  |
| Memory   | `128Mi` | `512Mi` |

### Horizontal Pod Autoscaler

Kubernetes HPA is used as the reactive autoscaling baseline. The HPA reacts to the current CPU utilization of the application Pods.

| Configuration    | Value |
| ---------------- | ----- |
| Minimum Replicas | 1     |
| Maximum Replicas | 5     |
| CPU Target       | 50%   |

The HPA configuration is located at `backend/k8s/hpa.yaml`.

---

## Monitoring

Prometheus is used to collect time-series metrics from the Kubernetes environment.

The primary metric used for forecasting is **CPU Utilization**.

Additional metrics are collected for evaluation:

- Memory utilization
- Response time
- Replica count
- Scaling events

An example Prometheus query for monitoring application CPU usage:

```promql
sum by (pod) (
  rate(container_cpu_usage_seconds_total{
    pod=~"ecommerce-backend-.*"
  }[1m])
)
```

The collected CPU utilization data forms the time-series dataset used by the forecasting stage.

---

## Workload Generation

Apache JMeter is used to generate HTTP requests against the e-commerce application.

The experimental workloads are designed according to four workload conditions:

1. Gradual Increase
2. Sudden Spike
3. Sustained Peak
4. Recovery

These scenarios represent different workload characteristics that may occur during large-scale e-commerce events and flash-crowd conditions.

All autoscaling configurations are evaluated using the same workload conditions to ensure a consistent comparison.

---

## Autoscaling Configurations

### 1. Reactive Autoscaling

The reactive configuration uses Kubernetes HPA. Scaling decisions are based on the current CPU utilization of the application.

```text
Current CPU Utilization
          |
          v
         HPA
          |
          v
 Scale Kubernetes Pods
```

### 2. Predictive Autoscaling

The predictive configuration uses the forecasting model to estimate future CPU utilization. The predicted value is used to determine proactive scaling decisions before an expected increase in CPU demand.

```text
Historical CPU Utilization
          |
          v
       Fremer
          |
          v
Predicted CPU Utilization
          |
          v
   Proactive Scaling
```

### 3. Hybrid Predictive-Reactive Autoscaling

The proposed configuration combines predictive scaling with Kubernetes HPA.

```text
     Fremer                   Current CPU
       |                          |
       v                          v
 Predicted CPU                   HPA
       |                          |
       v                          |
Proactive Scaling                 |
       |                          |
       +--------> Kubernetes <----+
                     Pods
```

The predictive component is intended to anticipate increases in CPU demand, while HPA provides reactive scaling when workload changes are not accurately anticipated by the forecasting model.

---

## Experimental Evaluation

The three autoscaling configurations are evaluated using the same workload scenarios and experimental environment.

### Evaluation Metrics

| Category             | Metrics                                                         |
| -------------------- | --------------------------------------------------------------- |
| Forecasting          | MAE, MSE, RMSE                                                  |
| Application Performance | Average Response Time, P95 Response Time, Throughput, Error Rate |
| Autoscaling          | Scaling Delay, Replica Count, Scaling Events                    |
| Resource Utilization | CPU Utilization, Memory Utilization                             |

**Forecasting accuracy** is evaluated using:

- Mean Absolute Error (MAE)
- Mean Squared Error (MSE)
- Root Mean Squared Error (RMSE)

**Application performance** is evaluated using:

- Average Response Time
- P95 Response Time
- Throughput
- Error Rate

**Autoscaling behavior** is evaluated using:

- Scaling Delay
- Replica Count
- Scaling Events

**Resource consumption** is evaluated using:

- CPU Utilization
- Memory Utilization

The final experimental results are compared across reactive, predictive, and hybrid configurations under the same workload conditions.

---

## Experimental Data

The repository contains an initial autoscaling observation:

```text
autoscaling_event_20260929.csv
```

The file contains CPU utilization and replica observations collected during an experimental run.

> **Note:** This dataset represents an initial experimental observation and is not intended to represent the complete dataset for the final research evaluation. Additional datasets will be generated through systematic JMeter experiments and Prometheus monitoring.

---

## Development Environment

The current development and experimental environment includes:

- Windows
- Docker Desktop
- Kubernetes
- Node.js
- MySQL
- Prometheus
- Apache JMeter

The Kubernetes cluster is currently tested using Docker Desktop Kubernetes.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jasongonidjaja/ecommerce-autoscaling.git
cd ecommerce-autoscaling
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=3010

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_autoscaling
DB_PORT=3306
```

Replace the database credentials with the configuration of your local environment.

> **Note:** The `.env` file is excluded from Git using `.gitignore` and should not be committed to the repository.

---

## Running the Backend Locally

Start the development server:

```bash
npm run dev
```

Or run the application directly:

```bash
npm start
```

The backend will run on the port configured in the `.env` file.

---

## Docker

Build the Docker image from the `backend` directory:

```bash
docker build -t ecommerce-backend:1.0 .
```

The Kubernetes deployment currently uses the image `ecommerce-backend:1.0`, which is configured to be used locally by Kubernetes.

---

## Deploying to Kubernetes

Make sure Docker Desktop Kubernetes is running before deploying the application.

From the `backend` directory, apply the Kubernetes resources:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

Check the deployment, Pods, Service, and HPA:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get hpa
```

To continuously monitor the Pods:

```bash
kubectl get pods -w
```

---

## Research Status

This repository is part of an ongoing research project.

### Current Implementation

- [x] E-commerce backend
- [x] MySQL database integration
- [x] Docker containerization
- [x] Kubernetes deployment
- [x] Kubernetes Service
- [x] HPA-based reactive autoscaling
- [x] Prometheus monitoring
- [x] Initial JMeter workload experiments
- [x] Initial autoscaling data collection

### Research Components in Progress

- [ ] Fremer forecasting implementation
- [ ] Predictive autoscaling implementation
- [ ] Hybrid predictive-reactive autoscaling implementation
- [ ] Complete workload dataset collection
- [ ] Complete experimental evaluation
- [ ] Comparative analysis of autoscaling configurations

---

## Research References

The research is supported by previous studies related to cloud workload forecasting, e-commerce workloads, flash crowds, and Kubernetes autoscaling.

1. Z. Ferdinand et al., "Implementation of the Fremer Model to Optimize Kubernetes Configuration in Concert Ticketing Application Deployment," *IEEE IAICT*, 2026.
2. X. Zhang et al., "Workload Consolidation in Alibaba Clusters: The Good, the Bad, and the Ugly," in *Proceedings of the 13th ACM Symposium on Cloud Computing (SoCC)*, 2022, doi: [10.1145/3542929.3563465](https://doi.org/10.1145/3542929.3563465).
3. A. A. Adewojo and J. M. Bass, "A Novel Weight-Assignment Load Balancing Algorithm for Cloud Applications," *SN Computer Science*, 2023, doi: [10.1007/s42979-023-01702-7](https://doi.org/10.1007/s42979-023-01702-7).
4. Y. Ye et al., "Fremer: Lightweight and Effective Frequency Transformer for Workload Forecasting in Cloud Services," *Proceedings of the VLDB Endowment*, vol. 18, no. 11, pp. 3812–3825, 2025, doi: [10.14778/3749646.3749656](https://doi.org/10.14778/3749646.3749656).

---

## Repository

GitHub Repository: <https://github.com/jasongonidjaja/ecommerce-autoscaling>

---

## Citation

If this repository is used in academic work, please cite it as a software/code resource.

```text
J. A. H. G. et al.,
"Hybrid Predictive-Reactive Autoscaling for Kubernetes on E-Commerce Mega Sale,"
GitHub repository, 2026.
Available: https://github.com/jasongonidjaja/ecommerce-autoscaling
```

---

## License

This repository is intended for academic and research purposes.