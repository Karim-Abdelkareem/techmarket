# Analytics Dashboard

## Overview
The Analytics Dashboard provides a comprehensive view of the TechMarket platform's performance metrics. It visualizes key data points such as product statistics, user trends, and sales performance to help administrators and moderators make data-driven decisions.

## Features
- **Overview Cards**: Display total users, total products, and top viewed product at a glance
- **Product Category Distribution**: Pie chart showing the distribution of products across different categories
- **User Signup Trends**: Bar chart tracking user registration patterns over the last 12 months
- **Average Price by Category**: Bar chart comparing average product prices across categories
- **Most Viewed Products**: Table listing the top 5 most viewed products with details
- **Top Discounted Products**: Table showing products with the highest discount percentages

## Implementation Details

### Backend
The analytics data is provided by the following endpoints in the `analyticsController.js`:
- `/api/analytics/dashboard` - Combined dashboard data
- `/api/analytics/overview` - Basic statistics
- `/api/analytics/products` - Product statistics
- `/api/analytics/users` - User signup trends
- `/api/analytics/most-viewed` - Most viewed products

All endpoints are protected and require authentication with admin or moderator roles.

### Frontend
The dashboard is implemented using:
- React for the UI components
- Recharts for data visualization
- Tailwind CSS for styling

## Usage
1. Navigate to the dashboard using the sidebar menu
2. Select the "Analytics" option
3. The dashboard will load automatically with the latest data
4. Hover over charts for detailed information

## Future Enhancements
- Real-time data updates
- Customizable date ranges for trend analysis
- Export functionality for reports
- Additional visualization types (line charts, heat maps)
- Drill-down capabilities for deeper analysis