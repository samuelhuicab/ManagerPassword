import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import { VaultProvider } from "./contexts/VaultContext";

import "./App.css";

function App() {

    return (

        <VaultProvider>

            <BrowserRouter>

                <Routes>

                    <Route

                        path="/"

                        element={<Dashboard />}

                    />

                </Routes>

            </BrowserRouter>

        </VaultProvider>

    );

}

export default App;