import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

// Üçüncü taraf bileşenler `className` almaz; withUniwind ile sarılır.
export const SafeAreaView = withUniwind(RNSafeAreaView);
