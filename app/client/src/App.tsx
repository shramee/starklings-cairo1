import { ThemeProvider, Typography, createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  argent,
  braavos,
  publicProvider,
  voyager,
} from "@starknet-react/core";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import { ErrorFallback } from "./components/error/ErrorFallback";
import { BasicLayout } from "./components/layout/BasicLayout";
import { CheckGitHubAccount } from "./components/pages/Check/CheckGitHubAccount";
import { CheckGraduates } from "./components/pages/Check/CheckGraduates";
import { FinalScreen } from "./components/pages/FinalScreen/FinalScreen";
import { Home } from "./components/pages/Home/Home";
import { Workspace } from "./components/pages/Workspace/Workspace";
import { PocApp } from "./components/poc/PocApp";
import { StarknetProvider } from "./context/StarknetProvider";
import { useNotification } from "./hooks/useNotification";
import { EvaluateGraduates } from "./components/pages/EvaluateGraduates/EvaluateGraduates";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const { showError } = useNotification();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        showError(error.message);
      },
    }),
  });

  const chains = [sepolia];
  const provider = publicProvider();
  const connectors = [braavos(), argent()];

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StarknetConfig
        chains={chains}
        provider={provider}
        connectors={connectors}
        explorer={voyager}
      >
        <StarknetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={darkTheme}>
              <BasicLayout>
                <>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/poc" element={<PocApp />} />
                    <Route path="/exercise/:id" element={<Workspace />} />
                    <Route path="/end" element={<FinalScreen />} />
                    <Route
                      path="/check/:account"
                      element={<CheckGitHubAccount />}
                    />{" "}
                    <Route path="/graduates" element={<CheckGraduates />} />
                    <Route path="/evaluate-students" element={<EvaluateGraduates />} />
                  </Routes>
                  <Box sx={{ position: "fixed", bottom: 0, right: 0 }}>
                    <Typography
                      sx={{ mb: 1, mr: 2, fontSize: 13, color: "#b0b0b0" }}
                    >
                      powered by Starknet Foundation
                    </Typography>
                  </Box>
                </>
              </BasicLayout>
            </ThemeProvider>
          </QueryClientProvider>
        </StarknetProvider>
      </StarknetConfig>
    </ErrorBoundary>
  );
}

export default App;
