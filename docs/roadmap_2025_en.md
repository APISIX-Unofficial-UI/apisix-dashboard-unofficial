
# apisix-dashboard-unofficial Roadmap 2025

## Inspiration and Vision

As the official APISIX Dashboard has been unmaintained for a long time and is no longer functional with APISIX 3.9 and later versions, the **apisix-dashboard-unofficial** project aims to provide a sustainable frontend management dashboard for Apache APISIX. Developed using the **TypeScript + Vue** stack and following cloud-native principles, although **unofficial**, we aim to polish it to be more feature-rich, user-friendly, and reliable than the official version, making it truly production-ready. Our goal is to enable individual developers and small to medium-sized enterprises to configure and manage their APISIX gateways more conveniently.

-   **For Individual Developers**: Provide a quick-start frontend deployment toolkit, simplifying the configuration and management of common features like routes, upstreams, and plugins.
-   **For Enterprises / Users with High Security Requirements**: Offer the option to integrate with a backend forwarding service for identity authentication and access control, balancing ease of use with security.

---

## 2025 Q1 - Q2 — Release v0.0.1 Minimum Viable Product (MVP)

1.  **Project Structure & Documentation**
    -   Define the overall structure of frontend pages and the design of core components.
    -   Provide local development and deployment instructions to help new users get started quickly.

2.  **Basic Authentication System**
    -   Implement frontend login authentication, supporting basic admin key login.

3.  **Route/Upstream/Service Management**
    -   CRUD operations for Routes: Support multiple matching rules (path, host, method, etc.).
    -   Upstream configuration: Configure timeouts, health checks, service discovery, etc.
    -   Service configuration: Similar to Upstreams, allowing for more settings.

4.  **Plugin Management**
    -   Fetch plugin schemas and cache them in the browser.
    -   Provide generic editing modes like JSON / YAML.

5.  **Consumer Management**
    -   Support creating, modifying, and deleting Consumers.
    -   Support creating Consumer Groups for hierarchical management.

6.  **Simple Backend Forwarding Service**
    -   Use Redis or shared etcd for data storage (further discussion needed).
    -   Provide multiple basic authentication methods (e.g., JWT) to enhance production environment security.

7.  **Basic DevOps / CI-CD**
    -   Set up a basic Continuous Integration (CI) pipeline, including at least code formatting checks (ESLint/Prettier, etc.).
    -   Write basic unit tests for core functionalities.

---

## 2025 Q3 — Release First Official Version (v1.0.0)

1.  **Comprehensive Code Quality Improvement**
    -   Optimize project modularity and architectural design to reduce coupling.
    -   Introduce more comprehensive automated testing, including unit and end-to-end (E2E) tests, improving code coverage.
    -   Conduct static analysis and regular audits for security and performance.

2.  **Enhanced Plugin Support**
    -   Provide more refined and user-friendly visual configuration interfaces for common plugins (e.g., rate limiting, authentication, rewriting).
    -   Add schema-based validation and auto-completion on top of the existing JSON / YAML editors.

3.  **Expand APISIX Feature Support**
    -   Support the full APISIX Admin API.
    -   Provide more extensible features (e.g., custom service discovery).
    -   Enhance interaction with APISIX Admin/Control APIs to provide real-time status monitoring or visual statistics.

4.  **Control Plane Management Support**
    -   Explore visual support for Control Plane deployment mode, allowing users to manage and monitor the APISIX control plane more easily.
    -   Research solutions for switching between multiple clusters and environments, providing support for large-scale deployment scenarios.

5.  **Dashboard High Availability & Cloud-Native**
    -   Develop a high-availability (HA) solution capable of running in distributed environments, ensuring fault tolerance and scalability in production.
    -   Integrate with common load balancing and service discovery mechanisms, providing more robust disaster recovery solutions for enterprise scenarios.

---

This roadmap will be continuously updated as the project evolves. If you are interested in visual management for APISIX gateways or frontend engineering, we welcome you to join the development of **apisix-dashboard-unofficial** and work together towards a better APISIX management experience!