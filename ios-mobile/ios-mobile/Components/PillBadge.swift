import SwiftUI

struct PillBadge: View {
    enum Status {
        case triggered
        case watching

        var text: String {
            switch self {
            case .triggered: return "Triggered"
            case .watching: return "Watching"
            }
        }

        var color: Color {
            switch self {
            case .triggered: return .positive
            case .watching: return .gray
            }
        }
    }

    let status: Status

    var body: some View {
        Text(status.text)
            .font(.caption.weight(.semibold))
            .foregroundStyle(status.color)
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(status.color.opacity(0.12), in: Capsule())
    }
}

#Preview {
    PillBadge(status: .triggered)
    PillBadge(status: .watching)
}
