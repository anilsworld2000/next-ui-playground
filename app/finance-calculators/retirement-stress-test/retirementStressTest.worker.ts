import { runMonteCarlo, type MonteCarloParams, type MonteCarloResult } from "../../../lib/financeCalculations";

interface SimulationRequest {
    params: MonteCarloParams;
    iterations: number;
}

type SimulationResponse =
    | { status: "success"; result: MonteCarloResult }
    | { status: "error"; message: string };

self.onmessage = (event: MessageEvent<SimulationRequest>) => {
    const replyPort = event.ports[0];
    if (!replyPort) return;

    let response: SimulationResponse;
    try {
        response = {
            status: "success",
            result: runMonteCarlo(event.data.params, event.data.iterations),
        };
    } catch (error) {
        response = {
            status: "error",
            message: error instanceof Error
                ? error.message
                : "The retirement simulation could not be completed.",
        };
    }

    replyPort.postMessage(response);
    replyPort.close();
};
