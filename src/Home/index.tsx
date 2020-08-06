import React, { FunctionComponent } from "react"
import {
  ScrollView,
  Alert,
  Linking,
  StyleSheet,
  ImageBackground,
  Image,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { usePermissionsContext } from "../PermissionsContext"
import { useStatusBarEffect } from "../navigation"
import { isPlatformiOS } from "../utils/index"
import { ENPermissionStatus } from "../PermissionsContext"
import { GlobalText } from "../components/GlobalText"

import { Icons, Images } from "../assets"
import {
  Spacing,
  Colors,
  Typography,
  Layout,
  Outlines,
  Iconography,
} from "../styles"

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

  const headerText = isEnabledAndAuthorized
    ? t("home.bluetooth.tracing_on_header")
    : t("home.bluetooth.tracing_off_header")
  const subheaderText = isEnabledAndAuthorized
    ? t("home.bluetooth.all_services_on_subheader")
    : t("home.bluetooth.tracing_off_subheader")

  return (
    <ImageBackground
      style={style.backgroundImage}
      source={Images.BlueGradientBackground}
    >
      <View style={style.concentricCirclesContainer}>
        <SvgXml
          xml={Icons.StateNoContact}
          width={2 * Layout.screenWidth}
          height={2 * Layout.screenHeight}
          accessible
          accessibilityLabel={t("label.check")}
        />
      </View>
      <View style={style.textContainer}>
        <GlobalText style={style.headerText} testID={"home-header"}>
          {headerText}
        </GlobalText>
        <GlobalText style={style.subheaderText} testID={"home-subheader"}>
          {subheaderText}
        </GlobalText>
      </View>
      <ScrollView style={style.bottomContainer}>
        <View style={style.shareContainer}>
          <View style={style.shareImageContainer}>
            <Image source={Images.HugEmoji} style={style.shareImage} />
          </View>
          <View style={style.shareTextContainer}>
            <GlobalText style={style.shareText}>
              {t("home.bluetooth.share")}
            </GlobalText>
          </View>
          <View style={style.shareIconContainer}>
            <SvgXml
              xml={Icons.Share}
              width={Iconography.small}
              height={Iconography.small}
            />
          </View>
        </View>
        <View style={style.activationStatusSectionContainer}>
          <ActivationStatusSection
            headerText={t("home.bluetooth.bluetooth_header")}
            bodyText={t("common.enabled")}
          />
          <ActivationStatusSection
            headerText={t("home.bluetooth.proximity_tracing_header")}
            bodyText={t("common.enabled")}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

interface ActivationStatusProps {
  headerText: string
  bodyText: string
}

const ActivationStatusSection: FunctionComponent<ActivationStatusProps> = ({
  headerText,
  bodyText,
}) => {
  return (
    <View style={style.activationStatusContainer}>
      <SvgXml
        xml={Icons.CheckInCircle}
        fill={Colors.primaryGreen}
        width={Iconography.medium}
        height={Iconography.medium}
      />
      <View style={style.activationStatusTextContainer}>
        <GlobalText style={style.bottomHeaderText}>{headerText}</GlobalText>
        <GlobalText style={style.bottomBodyText}>{bodyText}</GlobalText>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  concentricCirclesContainer: {
    position: "absolute",
    left: "-50%",
    bottom: "-30%",
  },
  textContainer: {
    alignSelf: "center",
    marginHorizontal: Spacing.medium,
    position: "absolute",
    top: "30%",
    alignItems: "center",
  },
  headerText: {
    ...Typography.header2,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  subheaderText: {
    ...Typography.header5,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.primaryBackground,
    maxHeight: Layout.screenHeight / 2 - 50,
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.small,
    backgroundColor: Colors.faintGray,
    borderBottomColor: Colors.lightestGray,
    borderBottomWidth: Outlines.hairline,
  },
  shareImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.tertiaryViolet,
    borderRadius: Outlines.borderRadiusMax,
    width: Iconography.medium,
    height: Iconography.medium,
  },
  shareImage: {
    width: Iconography.small,
    height: Iconography.small,
  },
  shareTextContainer: {
    flex: 1,
    marginHorizontal: Spacing.medium,
  },
  shareText: {
    ...Typography.header4,
  },
  shareIconContainer: {
    padding: Spacing.xxxSmall,
  },
  activationStatusSectionContainer: {
    marginBottom: Spacing.small,
  },
  activationStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.large,
    marginHorizontal: Spacing.small,
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.lightestGray,
  },
  activationStatusTextContainer: {
    marginLeft: Spacing.medium,
  },
  bottomHeaderText: {
    ...Typography.header4,
    marginBottom: Spacing.xxxSmall,
  },
  bottomBodyText: {
    ...Typography.secondaryContent,
  },
})

export default HomeScreen

