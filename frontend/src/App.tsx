import { AppRouter } from "./app/router/AppRouter";

 function App() {
    console.log(
    "API URL:",
    import.meta.env.VITE_API_BASE_URL,
);
 return <AppRouter />;
}

export default App;