import SwiftUI

extension View {
    func tabularNumbers() -> some View {
        monospacedDigit()
    }
    
    func hairlineField() -> some View {
        textFieldStyle(.plain).modifier(HairlineFieldModifier())
    }
}
