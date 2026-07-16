import FirebaseAuth
import Foundation

struct FirebaseAuthService: AuthService {
    private let client: APIClient

    init(client: APIClient = .shared) {
        self.client = client
    }

    var authStateChanges: AsyncStream<AppUser?> {
        AsyncStream { continuation in
            let handle = Auth.auth().addStateDidChangeListener { _, firebaseUser in
                continuation.yield(firebaseUser.map {
                    AppUser(
                        uid: $0.uid,
                        email: $0.email,
                        emailVerified: $0.isEmailVerified,
                        createdAt: $0.metadata.creationDate
                    )
                })
            }
            continuation.onTermination = { _ in
                Auth.auth().removeStateDidChangeListener(handle)
            }
        }
    }

    func login(email: String, password: String) async throws {
        do {
            try await Auth.auth().signIn(withEmail: email, password: password)
        } catch {
            throw mapError(error, [.invalidCredential: .wrongCredentials, .userNotFound: .wrongCredentials])
        }
    }

    func register(email: String, password: String) async throws {
        do {
            try await Auth.auth().createUser(withEmail: email, password: password)
        } catch {
            throw mapError(error, [.emailAlreadyInUse: .emailAlreadyInUse, .weakPassword: .weakPassword])
        }
    }

    func logout() throws {
        do {
            try Auth.auth().signOut()
        } catch {
            throw AuthError.generic(error.localizedDescription)
        }
    }

    func resetPassword(email: String) async throws {
        do {
            try await Auth.auth().sendPasswordReset(withEmail: email)
        } catch {
            throw mapError(error, [:])
        }
    }

    private func mapError(_ error: Error, _ mapping: [AuthErrorCode: AuthError]) -> AuthError {
        guard let code = firebaseCode(from: error) else {
            return .generic(error.localizedDescription)
        }
        if code == .networkError {
            return .networkError
        }
        return mapping[code] ?? .generic(error.localizedDescription)
    }

    private func firebaseCode(from error: Error) -> AuthErrorCode? {
        let nsError = error as NSError
        guard nsError.domain == AuthErrorDomain else { return nil }
        return AuthErrorCode(rawValue: nsError.code)
    }

    func deleteAccount() async throws {
        try await client.delete("/account")
    }
}
