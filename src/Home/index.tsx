import React, { FunctionComponent } from "react"
import { Alert, Linking, StyleSheet, ImageBackground, View } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import env from "react-native-config"

import { usePermissionsContext } from "../PermissionsContext"
import { useStatusBarEffect } from "../navigation"
import { isPlatformiOS } from "../utils/index"
import { ENPermissionStatus } from "../PermissionsContext"
import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"

import { Icons, Images } from "../assets"
import { Spacing, Colors, Typography, Layout } from "../styles"

const HomeScreen: FunctionComponent = () => {
  useStatusBarEffect("light-content")
  const { exposureNotifications } = usePermissionsContext()
  const { t } = useTranslation()

  const [
    authorization,
    enablement,
  ]: ENPermissionStatus = exposureNotifications.status
  const isEnabled = enablement === "ENABLED"
  const isAuthorized = authorization === "AUTHORIZED"
  const isEnabledAndAuthorized = isEnabled && isAuthorized

  const showUnauthorizedAlert = () => {
    Alert.alert(
      t("home.bluetooth.unauthorized_error_title"),
      t("home.bluetooth.unauthorized_error_message"),
      [
        {
          text: t("common.settings"),
          onPress: () => Linking.openSettings(),
        },
      ],
    )
  }

  const handleRequestPermission = () => {
    if (isAuthorized) {
      exposureNotifications.request()
    } else if (isPlatformiOS()) {
      showUnauthorizedAlert()
    }
  }

  const appName = env.IN_APP_NAME || "PathCheck"

  const headerText = isEnabledAndAuthorized
    ? appName
    : t("home.bluetooth.tracing_off_header")
  const subheaderText = isEnabledAndAuthorized
    ? t("home.bluetooth.all_services_on_subheader")
    : t("home.bluetooth.tracing_off_subheader")
  const buttonText = t("home.bluetooth.tracing_off_button")

  return (
    <ImageBackground
      style={style.backgroundImage}
      source={Images.BlueGradientBackground}
    >
      <View style={style.iconContainer}>
        <SvgXml
          xml={Icons.StateNoContact}
          accessible
          accessibilityLabel={t("label.check")}
          width={2 * Layout.screenWidth}
          height={2 * Layout.screenHeight}
        />
      </View>
      <View style={style.homeContainer}>
        <View style={style.container}>
          <>
            <GlobalText style={style.headerText} testID={"home-header"}>
              {headerText}
            </GlobalText>
            <GlobalText style={style.subheaderText} testID={"home-subheader"}>
              {subheaderText}
            </GlobalText>
          </>
          {!isEnabledAndAuthorized ? (
            <Button
              invert
              testID={"home-request-permissions-button"}
              onPress={handleRequestPermission}
              label={buttonText}
            />
          ) : null}
        </View>
      </View>
    </ImageBackground>
  )
}

const style = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  iconContainer: {
    position: "absolute",
    left: -(Layout.screenWidth / 2),
    bottom: -(Layout.screenHeight / 3),
  },
  homeContainer: {
    flex: 1,
  },
  container: {
    justifyContent: "flex-end",
    backgroundColor: Colors.primaryBackground,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  headerText: {
    ...Typography.xLargeFont,
    ...Typography.bold,
    lineHeight: Typography.mediumLineHeight,
    textAlign: "center",
  },
  subheaderText: {
    ...Typography.header4,
    textAlign: "center",
    marginTop: Spacing.medium,
  },
})

export default HomeScreen

