import { createNativeStackNavigator } from "@react-navigation/native-stack"
import PreferredTimings from "./PreferredTimings"
import VehicleSelection from "./VehicleSelection"
import WorkArea from "./WorkArea"
import OrderDeliveryType from "./OrderDeliveryType"

const WorkStack = createNativeStackNavigator()

const WorkDetails = () => {
    return (
        <WorkStack.Navigator
            initialRouteName="preferred-timings"
        >
            <WorkStack.Screen name="preferred-timings" component={PreferredTimings} options={{ headerShown: false }} />
            <WorkStack.Screen name="vehicle-selection" component={VehicleSelection} options={{ headerShown: false }} />
            <WorkStack.Screen name="work-area" component={WorkArea} options={{ headerShown: false }} />
            <WorkStack.Screen name="order-delivery-type" component={OrderDeliveryType} options={{ headerShown: false }} />
        </WorkStack.Navigator>
    )
}

export default WorkDetails

