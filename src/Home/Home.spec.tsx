import React from "react"
import { Alert, Platform } from "react-native"
import { render, cleanup, wait, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import Home from "./Home"
import {
  usePermissionsContext,
  ENPermissionStatus,
} from "../PermissionsContext"

afterEach(cleanup)

jest.mock("../PermissionsContext")
describe("Home", () => {
  describe("When the enPermissionStatus is enabled and authorized and Bluetooth is on", () => {
    it("renders a notifications are enabled message", () => {
      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "ENABLED"]
      ;(usePermissionsContext as jest.Mock).mockReturnValueOnce({
        enPermissionStatus,
      })

      const { getByTestId } = render(<Home />)

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
        const enPermissionStatus: ENPermissionStatus = [
          "UNAUTHORIZED",
          "DISABLED",
        ]
        const requestPermission = jest.fn()
        ;(usePermissionsContext as jest.Mock).mockReturnValueOnce({
          enPermissionStatus,
          requestPermission,
        })
        const alert = jest.spyOn(Alert, "alert")

        const { getByTestId } = render(<Home />)
        const button = getByTestId("home-request-permissions-button")

        fireEvent.press(button)
        await wait(() => {
          if (Platform.OS === "ios") {
            expect(alert).toHaveBeenCalled()
          } else {
            expect(alert).not.toHaveBeenCalled()
          }
        })
      })
    })

    it("it renders a notification are not enabled message", () => {
      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "DISABLED"]
      const requestPermission = jest.fn()

      const { getByTestId } = render(<Home />)

      const header = getByTestId("home-header")
      const subheader = getByTestId("home-subheader")

      expect(header).toHaveTextContent("Exposure Notifications Disabled")
      expect(subheader).toHaveTextContent(
        "Enable Exposure Notifications to receive information about possible exposures",
      )
    })

    it("it renders an Enable Notifications button which requests permissions", async () => {
      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "DISABLED"]
      const requestPermission = jest.fn()

      const { getByTestId } = render(<Home />)
      const button = getByTestId("home-request-permissions-button")

      fireEvent.press(button)
      await wait(() => {
        expect(requestPermission).toHaveBeenCalled()
      })
    })
  })
})
