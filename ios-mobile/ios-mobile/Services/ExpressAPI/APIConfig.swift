import Foundation

nonisolated enum APIConfig {
    // iOS Sim can reach the localhost directly
    static let baseURL = URL(string: "http://localhost:3000")!
}
