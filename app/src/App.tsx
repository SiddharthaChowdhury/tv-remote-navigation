import { useEffect, useState } from "react";
import { HomePage } from "./examples/Home.page";
import { View } from "./examples/react-native.components";
import { Modal } from "./examplesV2/Modal";
import { HomePageV2 } from "./examplesV2/HomeV2.page";
import { SpacialHomeExV3 } from "./exampleV3_spacial/SpacialHome";

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
      <SpacialHomeExV3 behavior={"spacial-rows"} />
    </View>
  );
};
