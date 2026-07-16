import Foundation

protocol AuthService {
    var authStateChanges: AsyncStream<AppUser?> { get }

    func login(email: String, password: String) async throws
    func register(email: String, password: String) async throws
    func logout() throws
    func resetPassword(email: String) async throws
    func deleteAccount() async throws
}
