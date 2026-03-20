# 🧵 Embroidery Automation Pipeline (EAP)

An event-driven task processing system designed to automate embroidery order workflows. The system ingests raw webhook data, processes it through a custom-built rule engine, and delivers structured results to subscribers with built-in reliability and a real-time monitoring dashboard.

---

## 🏗️ Architecture Overview

The project is built using a **Producer-Consumer Pattern** to ensure the system is scalable and asynchronous:

1.  **API Gateway (Producer):** A high-performance Express.js server that receives incoming Webhooks and immediately queues them into the PostgreSQL database as "Pending Jobs."
2.  **Background Worker (Consumer):** A dedicated service that polls the database, marks jobs as "Processing," and executes the business logic.
3.  **Custom Processing Engine:** Instead of manual entry, this engine uses **Regex (Regular Expressions)** and **Keyword Mapping** to extract customer names, product types, and estimated prices from raw text.
4.  **Reliable Dispatcher:** Forwards the processed data to subscriber URLs using a **Retry Strategy** (up to 3 attempts) to handle network failures.
5.  **Monitoring Dashboard:** A React-based UI that visualizes the pipeline’s real-time status and job history.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript, Express.js
- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons
- **Database:** PostgreSQL with **Drizzle ORM**
- **Infrastructure:** Docker, Docker Compose
- **DevOps:** GitHub Actions (CI/CD Pipeline)

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have **Docker** and **Docker Compose** installed.

### 2. Installation

1.  **Clone the repo:**
    ```bash
    git clone <https://github.com/mriana9/Embroidery-Automation-Pipeline-EAP-.git>
    cd EmbroideryAutomationPipeline
    ```
2.  **Environment Setup:**
    The system is pre-configured for Docker, but ensure your `.env` reflects your database credentials.

3.  **Launch with Docker:**
    ```bash
    docker-compose up --build
    ```

### 3. Access

- **Dashboard:** `http://localhost:5173`
- **API Server:** `http://localhost:3000`

---

## 💡 Technical Design Decisions

- **Separation of Concerns:** The processing logic is isolated in a `processor.ts` service, making it easy to swap the current Rule-Engine for an AI model in the future without touching the Worker's core logic.
- **Zero-Cost Processing:** By building a custom Regex-based parser, the system processes orders instantly with zero API costs and no external dependencies.
- **Data Integrity:** Used **Drizzle ORM** to ensure type-safety across the stack, reducing runtime errors between the database and the UI.
- **Reliability:** Implemented a **Background Polling** mechanism so that if the server restarts, no jobs are lost; they remain in the DB until successfully processed.

---

## ✅ Requirements Progress

- [x] CRUD API for Pipelines/Subscribers
- [x] Async Webhook Ingestion (Queue System)
- [x] Background Worker with Job Polling
- [x] Custom Processing Actions (Name Extraction, Pricing, Priority, Price Estimator)
- [x] Subscriber Delivery with Retry Logic
- [x] Docker Compose Setup
- [x] GitHub Actions CI/CD (Green Build ✅)
- [x] **Bonus:** Full Real-time Dashboard UI

---

## 👤 Author

**[Mariana Algafy]**
_Developed as a Final Project for the FTS Internship._
