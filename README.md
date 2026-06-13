# 🛡️ SentinelScope Express API

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![Status](https://img.shields.io/badge/Status-Active_Development-success)
![API](https://img.shields.io/badge/API-REST-blue)
![Phase](https://img.shields.io/badge/Phase-3B.4_COMPLETE-blue)
![License](https://img.shields.io/badge/License-MIT-green)

> Backend services powering SentinelScope's cybersecurity operations, intelligence enrichment, persistence, telemetry, and threat intelligence architecture.

---

## 🚀 Project Overview

SentinelScope Express provides the backend infrastructure for the SentinelScope platform.

The API is responsible for mission management, scan persistence, findings intelligence, alert intelligence, runtime recovery, telemetry services, and advanced threat intelligence persistence.

All operational data is persisted in MongoDB Atlas and exposed through a modular REST API architecture.

---

## 🏗️ Backend Architecture

```text
React Dashboard
        ↓
REST API
        ↓
Express Controllers
        ↓
Persistence Services
        ↓
MongoDB Atlas
```

---

## 🧠 Intelligence Pipeline

```text
Mission
   ↓
Scan
   ↓
Finding
   ↓
Alert
   ↓
Threat Context
   ↓
Threat Narrative
   ↓
Business Impact
   ↓
Threat Actor
   ↓
MITRE ATT&CK Mapping
   ↓
Risk Assessment
   ↓
MongoDB Persistence
```

---

## 📦 Core Data Models

### Mission

- Mission Persistence
- Mission State Tracking
- Mission-to-Scan Relationships
- Mission Recovery Support

### Scan

- Runtime Persistence
- State Synchronization
- Progress Tracking
- Recovery Management

### Finding

- Severity Classification
- Category Tracking
- Scan Correlation
- Mission Correlation

### Alert

- Alert Lifecycle Tracking
- Risk Scoring
- Threat Intelligence
- Related Findings Correlation

---

## 🧠 Intelligence Models

### Threat Context Intelligence

- Category
- Attack Stage
- Impact
- Confidence

### Threat Narrative Intelligence

- Summary
- Operator Guidance

### Business Impact Intelligence

- Impact Level
- Impact Summary

### Threat Actor Intelligence

- Actor Profile
- Confidence
- Description

### MITRE ATT&CK Intelligence

- Tactic
- Technique
- Technique ID
- Confidence

### Risk Intelligence

- Dynamic Risk Scoring
- Severity Correlation
- Finding Correlation

---

## 🔗 API Endpoints

### Missions

/api/missions

### Scans

/api/scans

### Findings

/api/findings

### Alerts

/api/alerts

### Telemetry

/api/telemetry

### Health

/api/health

---

## 🗄️ MongoDB Collections

```text
missions
scans
findings
alerts
telemetry
```

---

## ⚙️ Technology Stack

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- REST APIs

### Services

- Mission Persistence Services
- Scan Persistence Services
- Findings Persistence Services
- Alert Persistence Services
- Runtime Recovery Services
- Threat Intelligence Services

---

## 🔥 Current Development Status

### ✅ Completed

- Mission Persistence
- Scan Persistence
- Findings Persistence
- Alert Persistence
- Runtime Recovery
- Mission Synchronization
- Findings Intelligence
- Alert Intelligence
- Threat Context Intelligence
- Threat Narrative Intelligence
- Business Impact Intelligence
- Threat Actor Intelligence
- MITRE ATT&CK Intelligence
- Dynamic Risk Scoring
- MongoDB Atlas Integration

### 🚧 Current Phase

**Phase 3B.5 — Intelligence Confidence Scoring**

### 🔮 Planned

- Executive Risk Intelligence
- Incident Management
- Reporting Engine
- Asset Correlation
- Attack Surface Intelligence
- Scan Scheduling
- Multi-User Support
- Role-Based Access Control

---

## 📈 Project Progress

| Area | Completion |
|--------|--------|
| API Services | 95% |
| Persistence Layer | 100% |
| Mission Management | 100% |
| Scan Management | 100% |
| Findings Intelligence | 100% |
| Alert Intelligence | 100% |
| Threat Intelligence | 100% |
| MITRE ATT&CK Intelligence | 100% |
| Reporting Engine | 45% |

## ~92% Complete

---

## 🛠️ Installation

```bash
git clone https://github.com/FHobbs8030/sentinelscope-express.git
cd sentinelscope-express
npm install
npm run dev
```

---

## 🧠 Engineering Principles

- Modularity
- Scalability
- Maintainability
- Resiliency
- Observability
- Operational Clarity
- Extensibility

---

## 🛰️ Future Vision

SentinelScope Express is evolving into a security intelligence backend capable of supporting advanced threat intelligence, incident response workflows, executive risk reporting, attack surface intelligence, and large-scale operational visibility through a modern REST API architecture.
