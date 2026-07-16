import FirebaseAuth
import Foundation

nonisolated struct APIClient {
    static let shared = APIClient()

    private let session: URLSession
    private let decoder: JSONDecoder
    private let encoder: JSONEncoder
    private let tokenProvider: @Sendable () async -> String?

    init(
        session: URLSession = .shared,
        tokenProvider: @escaping @Sendable () async -> String? = {
            try? await Auth.auth().currentUser?.getIDToken()
        }
    ) {
        self.session = session
        self.decoder = JSONDecoder()
        self.encoder = JSONEncoder()
        self.tokenProvider = tokenProvider
    }

    func get<Response: Decodable>(_ path: String) async throws -> Response {
        var request = try await authorizedRequest(path)
        request.httpMethod = "GET"
        return try await send(request)
    }

    func post<Body: Encodable, Response: Decodable>(_ path: String, body: Body) async throws -> Response {
        var request = try await authorizedRequest(path)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try encoder.encode(body)
        return try await send(request)
    }

    func delete(_ path: String) async throws {
        var request = try await authorizedRequest(path)
        request.httpMethod = "DELETE"
        let (_, response) = try await session.data(for: request)
        try validate(response)
    }

    private func authorizedRequest(_ path: String) async throws -> URLRequest {
        var request = URLRequest(url: APIConfig.baseURL.appendingPathComponent(path))
        request.cachePolicy = .reloadIgnoringLocalCacheData
        if let token = await tokenProvider() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        return request
    }

    private func send<Response: Decodable>(_ request: URLRequest) async throws -> Response {
        let (data, response) = try await session.data(for: request)
        try validate(response)
        do {
            return try decoder.decode(Response.self, from: data)
        } catch {
            throw APIError.decoding(error)
        }
    }

    private func validate(_ response: URLResponse) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        guard (200..<300).contains(httpResponse.statusCode) else {
            throw APIError.server(statusCode: httpResponse.statusCode)
        }
    }
}
