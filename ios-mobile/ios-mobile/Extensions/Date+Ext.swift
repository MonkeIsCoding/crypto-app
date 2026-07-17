import Foundation

extension Date {
    /// Parses an ISO 8601 date string from the backend, with or without fractional seconds.
    init?(iso8601 string: String) {
        if let date = ISO8601DateFormatter.withFractionalSeconds.date(from: string) {
            self = date
        } else if let date = ISO8601DateFormatter.withoutFractionalSeconds.date(from: string) {
            self = date
        } else {
            return nil
        }
    }
}
