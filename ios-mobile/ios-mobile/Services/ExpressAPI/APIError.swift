import Foundation

nonisolated enum APIError: Error, LocalizedError {
    case invalidResponse
    case server(statusCode: Int)
    case decoding(Error)

    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Received an invalid response from the server."
        case .server(let statusCode):
            return "Server returned status code \(statusCode)."
        case .decoding(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        }
    }
}
