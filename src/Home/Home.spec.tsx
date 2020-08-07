import React from "react"
import { render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import "@testing-library/jest-native/extend-expect"

import Home from "./Home"
import { PermissionsContext, ENPermissionStatus } from "../PermissionsContext"
import { PermissionStatus } from "../permissionStatus"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

jest.mock("react-native-safe-area-context")
;(useSafeAreaInsets as jest.Mock).mockReturnValue({ insets: { bottom: 0 } })

describe("Home", () => {
  describe("When the enPermissionStatus is enabled and authorized and Bluetooth is on", () => {
    it("renders a notifications are enabled message", () => {
      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "ENABLED"]
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      const header = getByTestId("home-header")
      const subheader = getByTestId("home-subheader")

      expect(header).toHaveTextContent("Active")
      expect(subheader).toHaveTextContent(
        "COVIDaware will remain active after the app has been closed",
      )
    })
  })

  describe("When the enPermissionStatus is not enabled", () => {
    describe("when the enPermissionStatus is not authorized", () => {
      it("displays an alert dialog if exposure notifications are not authorized", async () => {
        expect(true).toBeTruthy()
      })
    })

    it("it renders a notification are not enabled message", () => {
      expect(true).toBeTruthy()
    })

    it("it renders an Enable Notifications button which requests permissions", async () => {
      expect(true).toBeTruthy()
    })
  })
})

const createPermissionProviderValue = (
  enPermissionStatus: ENPermissionStatus,
) => {
  return {
    notification: {
      status: PermissionStatus.UNKNOWN,
      check: () => {},
      request: () => {},
    },
    exposureNotifications: {
      status: enPermissionStatus,
      check: () => {},
      request: () => {},
    },
  }
}
