import { useEffect, useState } from "react";
import { SpacialHomeExV3 } from "./exampleV3_spacial/SpacialHome";
import { View } from "./react-native.components";

export const App = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowModal(true);
    }, 5_000);

    setTimeout(() => {
      setShowModal(false);
    }, 15_000);
  }, []);

  return (
    <View style={{ position: "relative", width: "1200px", height: "800px" }}>
      {/* <HomePage grid showModal={showModal} /> */}
      {/* <HomePageV2 behavior="grid" />
      {showModal && <Modal />} */}
      <SpacialHomeExV3 behavior={"default"} />
    </View>
  );
};
