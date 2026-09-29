# Hybrid Predictive-Reactive Autoscaling for Kubernetes

This repository contains the implementation of a Kubernetes-based e-commerce
application developed to support research on **Hybrid Predictive-Reactive
Autoscaling under simulated Mega Sale workloads**.

The research evaluates reactive, predictive, and hybrid autoscaling mechanisms
under different workload conditions in a Kubernetes environment.

---

## Research Objective

The objective of this research is to evaluate the behavior of a
**Hybrid Predictive-Reactive Autoscaling** mechanism for a Kubernetes-based
e-commerce application under simulated Mega Sale workloads.

Three autoscaling configurations are evaluated:

1. **Reactive Autoscaling** using Kubernetes Horizontal Pod Autoscaler (HPA)
2. **Predictive Autoscaling** using CPU utilization forecasting
3. **Hybrid Predictive-Reactive Autoscaling** combining predictive scaling
   with Kubernetes HPA

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
                  Fremer Forecasting
                       Model
                           |
                           v
             Predicted CPU Utilization
                           |
                           v
                  Proactive Scaling
                           |
                           v
                    Kubernetes Pods
                           ^
                           |
                          HPA
                           |
                           v
                   Reactive Scaling


Apache JMeter is used to generate HTTP requests representing different
e-commerce workload conditions.

Prometheus is used to collect time-series monitoring data from the Kubernetes
environment. CPU utilization is used as the primary time-series input for
forecasting, while other metrics are used for performance and autoscaling
evaluation.

The forecasting stage uses Fremer, a frequency-domain Transformer model
for workload forecasting in cloud services.

Kubernetes HPA provides the reactive scaling mechanism, while the proposed
hybrid mechanism combines predictive and reactive scaling.

Technology Stack
Application
Node.js
Express.js
MySQL
REST API
Containerization
Docker
Orchestration
Kubernetes
Monitoring
Prometheus
Workload Generation
Apache JMeter
Forecasting
Fremer