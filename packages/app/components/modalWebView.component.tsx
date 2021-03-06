import { useApi } from '@skolplattformen/api-hooks'
import { Text } from '@ui-kitten/components'
import URI from 'jsuri'
import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { CloseIcon } from './icon.component'

interface ModalWebViewProps {
  url: string
  sharedCookiesEnabled: boolean
  onClose: () => void
}

export const ModalWebView = ({
  url,
  onClose,
  sharedCookiesEnabled,
}: ModalWebViewProps) => {
  const [modalVisible, setModalVisible] = React.useState(true)
  const { api } = useApi()
  const [headers, setHeaders] = useState()

  useEffect(() => {
    const getHeaders = async (urlToGetSessionFor: string) => {
      if (sharedCookiesEnabled) return
      const { headers: newHeaders } = await api.getSession(urlToGetSessionFor)
      setHeaders(newHeaders)
    }

    getHeaders(url)
  }, [url, sharedCookiesEnabled, api])

  const uri = new URI(url)

  const closeModal = () => {
    setModalVisible(false)
    onClose()
  }

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <Text category="s1">{uri.host()}</Text>
            <TouchableOpacity onPress={closeModal}>
              <CloseIcon style={styles.icon} fill="#333333" />
            </TouchableOpacity>
          </View>
        </View>
        {(headers || sharedCookiesEnabled) && (
          <WebView
            style={styles.webview}
            source={{ uri: url, headers }}
            sharedCookiesEnabled={sharedCookiesEnabled}
            thirdPartyCookiesEnabled={sharedCookiesEnabled}
          />
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: '#333333',
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  webview: {},
})
