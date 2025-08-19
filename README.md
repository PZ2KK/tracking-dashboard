# 📊 Tracking Dashboard

A modern, responsive dashboard for tracking shipments and packages with real-time updates and interactive charts.

## 🚀 Features

- **Interactive Dashboard** with key metrics and visualizations
- **Real-time Tracking** of shipments and packages
- **Responsive Design** that works on all devices
- **Interactive Charts** for data visualization
- **User Authentication** with secure login
- **Search & Filter** functionality for easy navigation
- **Voting System** for user engagement

## 🛠️ Technologies Used

- React 18
- Vite
- Tailwind CSS
- Recharts
- React Router
- React Icons
- Axios
- JSON Server (for mock API)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tracking-dashboard.git
   cd tracking-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. (Optional) Start the mock API server (in a separate terminal):
   ```bash
   npm run server
   ```

## 🔒 Authentication

Default login credentials:
- **Username:** admin
- **Password:** 1234

## 📊 Data

The application uses mock data stored in `public/mock-data.json`. This includes:
- 50+ sample tracking items
- Various statuses (In Transit, Delivered, Delayed, etc.)
- Historical tracking data

## 🚀 Deployment

### Vercel

1. Push your code to a GitHub repository
2. Import the repository on [Vercel](https://vercel.com/import)
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using modern web technologies

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
