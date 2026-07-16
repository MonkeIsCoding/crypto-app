import Foundation

nonisolated enum AuthError: Error, LocalizedError, Equatable {
    case wrongCredentials
    case emailAlreadyInUse
    case weakPassword
    case networkError
    case generic(String)

    var errorDescription: String? {
        switch self {
        case .wrongCredentials:
            return "Incorrect email or password."
        case .emailAlreadyInUse:
            return "An account already exists with that email."
        case .weakPassword:
            return "Password is too weak — use at least 6 characters."
        case .networkError:
            return "Couldn't reach the server. Check your connection."
        case .generic(let message):
            return message
        }
    }
}
