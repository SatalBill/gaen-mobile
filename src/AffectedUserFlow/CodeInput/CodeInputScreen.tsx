import React, { FunctionComponent } from "react"
import { SafeAreaView, View, StyleSheet } from "react-native"

import { usePermissionsContext, ENEnablement } from "../../PermissionsContext"
import CodeInputForm from "./CodeInputForm"
import EnableExposureNotifications from "./EnableExposureNotifications"

import { Colors } from "../../styles"

const CodeInputScreen: FunctionComponent = () => {
  const { exposureNotifications } = usePermissionsContext()

  const hasExposureNotificationsEnabled = (): boolean => {
    const enabledState: ENEnablement = "ENABLED"
    return exposureNotifications.status[1] === enabledState
  }
  const isEnabled = hasExposureNotificationsEnabled()

  return (
    <SafeAreaView style={style.safeAreaView}>
      {isEnabled ? <CodeInputForm /> : <EnableExposureNotifications />}
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  safeAreaView: {
    backgroundColor: Colors.white,
  },
})

export default CodeInputScreen
