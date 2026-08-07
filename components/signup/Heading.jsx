import { Text } from 'react-native'
import { colors } from '../../constants/colors'


const Heading = ({title,subtitle}) => {
    return (
        <>
        <Text style={{
            fontSize: 24,
            fontFamily: "OpenSans-Bold",
            color: colors.text,
            textAlign: "center",
            marginTop: 10
        }}>{title}</Text>
        <Text style={{
            fontSize: 12,
            fontFamily: "OpenSans-Bold",
            color: colors.text,
            textAlign: "center",
            marginTop: 10
        }}>{subtitle}</Text>
        </>
    )
}

export default Heading

