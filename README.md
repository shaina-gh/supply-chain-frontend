# Interactive Supply Chain BI Dashboard (Frontend)

This is the frontend for a full-stack Business Intelligence dashboard built with React. It provides an interactive interface for supply chain managers to analyze logistics data, identify inefficiencies, and make data-driven decisions.

**Live Demo**: supplychainshaina.netlify.app/ 

---


## 📈 Business Problem

In logistics, delays and inefficiencies can lead to significant financial losses and decreased customer satisfaction. This dashboard was built to solve this problem by providing a clear, interactive view of key performance indicators (KPIs) from a complex supply chain dataset. The goal is to empower a non-technical user (like a supply chain manager) to explore the data, identify bottlenecks, and uncover actionable insights without needing to write any code.

## 💡 Key Insights & Recommendations

The dashboard successfully visualizes several key metrics, leading to the following insights:

* **Insight 1 (Asset Performance)**: The "Average Waiting Time by Asset" chart allows for a quick comparison of all trucks. A manager can use the interactive filter to isolate a specific truck and investigate its performance. For example, if Truck_7 consistently has a higher waiting time, its routes or schedules may need review.
* **Insight 2 (Delay Analysis)**: The "Count of Delays by Reason" pie chart clearly shows that `Traffic` and `Weather` are the most common causes of delays. This suggests that the company's current routing system is vulnerable to these factors.
* **Recommendation**: Based on these insights, I would recommend the company invest in a more advanced route-planning software that incorporates real-time traffic and weather data to create more resilient and efficient delivery schedules.

## 🛠️ Tech Stack

* **React.js**: For building the user interface.
* **Recharts**: For creating dynamic and responsive charts.
* **Material-UI (MUI)**: For professional and consistent UI components like filters and cards.
* **Axios**: For making API calls to the backend service.
* **React Leaflet**: For rendering the interactive map visualization.
* **Netlify**: For continuous deployment and hosting.

## ⚙️ Running Locally

1.  Clone the repository:
    `git clone https://github.com/shaina-gh/supply-chain-frontend.git`
2.  Navigate into the directory:
    `cd supply-chain-frontend`
3.  Install dependencies:
    `npm install`
4.  Start the development server:
    `npm start`
5.  Ensure the [backend server](https://github.com/shaina-gh/supply-chain-backend) is also running.
