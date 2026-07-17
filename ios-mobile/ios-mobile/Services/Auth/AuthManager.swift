import Foundation

@Observable
@MainActor
final class AuthManager {
    private let service: AuthService

    private(set) var user: AppUser?
    private(set) var initializing = true
    private(set) var deletingAccount = false

    private var listener: Task<Void, Never>?

    init(service: AuthService) {
        self.service = service
        listener = Task { [weak self] in
            guard let self else { return }
            for await user in service.authStateChanges {
                self.user = user
                self.initializing = false
            }
        }
    }

    func login(email: String, password: String) async throws {
        try await service.login(email: email, password: password)
    }

    func register(email: String, password: String) async throws {
        try await service.register(email: email, password: password)
    }

    func logout() throws {
        try service.logout()
    }

    func resetPassword(email: String) async throws {
        try await service.resetPassword(email: email)
    }

    func deleteAccount() async throws {
        deletingAccount = true
        defer { deletingAccount = false }
        try await service.deleteAccount()
        try logout()
    }
}
