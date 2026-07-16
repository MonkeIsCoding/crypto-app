import Foundation

// App level user model, to remove coupling with the Firebase SDK.
nonisolated struct AppUser: Equatable {
    let uid: String
    let email: String?
    let emailVerified: Bool
    let createdAt: Date?
}
