import SwiftUI

extension ButtonStyle where Self == FilledCapsuleButtonStyle {
    static var filledCapsule: FilledCapsuleButtonStyle { FilledCapsuleButtonStyle() }
}

extension ButtonStyle where Self == HairlineOutlinedButtonStyle {
    static func hairlineOutlined(color: Color) -> HairlineOutlinedButtonStyle {
        HairlineOutlinedButtonStyle(color: color)
    }
}
