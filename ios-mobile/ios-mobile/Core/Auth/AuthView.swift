import SwiftUI

enum AuthMode: Hashable {
    case login
    case register
}

struct AuthView: View {
    @Environment(AuthManager.self) private var authManager

    @State private var mode: AuthMode
    @State private var email = ""
    @State private var password = ""
    @State private var submitting = false
    @State private var alertMessage: String?
    @State private var showAlert = false

    init(mode: AuthMode = .login) {
        _mode = State(initialValue: mode)
    }

    var body: some View {
        VStack(spacing: 16) {
            Text(mode == .login ? "Log in" : "Create account")
                .font(.largeTitle.bold())
                .padding(.bottom, 12)
                .animation(nil, value: mode)

            TextField("Email", text: $email)
                .textInputAutocapitalization(.never)
                .keyboardType(.emailAddress)
                .hairlineField()

            SecureField("Password", text: $password)
                .hairlineField()

            Button(mode == .login ? "Log in" : "Create account", action: submit)
                .buttonStyle(.filledCapsule)
                .padding(.top, 8)
                .disabled(submitting)

            Button(mode == .login ? "Need an account? Register" : "Have an account? Log in") {
                withAnimation {
                    mode = mode == .login ? .register : .login
                }
            }
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(Color.accentColor)
            .padding(.top, 4)

            if mode == .login {
                Button("Forgot password?", action: forgotPassword)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Color.accentColor)
                    .transition(.opacity)
            }
        }
        .padding(Theme.contentPadding)
        .frame(maxHeight: .infinity, alignment: .center)
        .alert(alertMessage ?? "", isPresented: $showAlert) {}
    }

    private func present(_ message: String) {
        alertMessage = message
        showAlert = true
    }

    private func submit() {
        guard !email.isEmpty, !password.isEmpty else {
            present("Enter both email and password.")
            return
        }
        submitting = true
        Task {
            defer { submitting = false }
            do {
                if mode == .login {
                    try await authManager.login(email: email, password: password)
                } else {
                    try await authManager.register(email: email, password: password)
                }
            } catch {
                present(error.localizedDescription)
            }
        }
    }

    private func forgotPassword() {
        guard !email.isEmpty else {
            present("Type your email above, then tap 'Forgot password' again.")
            return
        }
        Task {
            do {
                try await authManager.resetPassword(email: email)
                present("Password reset email sent.")
            } catch {
                present(error.localizedDescription)
            }
        }
    }
}

#Preview {
    AuthView()
        .environment(AuthManager.preview)
}
