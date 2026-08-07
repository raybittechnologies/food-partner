import { Dimensions, KeyboardAvoidingView, Text, TextInput, View } from "react-native"

const { height } = Dimensions.get("window")

const Input = ({ label, placeholder, type, value, onChange, error, maxLength, icon }) => {
    return (
        <KeyboardAvoidingView style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", marginTop: 10 }}>
            {label ? (
                <Text style={{ color: "#141414", marginLeft: "5%", fontFamily: "OpenSans-Regular", fontWeight: "300" }}>{label}</Text>
            ) : null}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    marginHorizontal: "auto",
                    marginVertical: 5,
                    height: height * (54 / height),
                    borderColor: error ? "#ff5555" : "#E0E0E0",
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    backgroundColor: "#fff",
                }}
            >
                {icon ? (
                    <View style={{ marginRight: 10 }}>{icon}</View>
                ) : null}

                <TextInput
                    value={value}
                    onChangeText={onChange}
                    keyboardType={type}
                    placeholderTextColor={"#9A9A9A"}
                    placeholder={placeholder}
                    maxLength={maxLength ?? null}
                    style={{
                        flex: 1,
                        fontFamily: "OpenSans-Regular",
                        fontSize: 16,
                        height: "100%",
                        color: "#141414",
                    }}
                />
            </View>

            {error ? (
                <Text style={{
                    color: "#ff5555",
                    fontFamily: "OpenSans-Regular",
                    fontSize: 12,
                    marginLeft: "5%",
                    marginTop: -2,
                }}>{error}</Text>
            ) : null}
        </KeyboardAvoidingView>
    )
}

export default Input