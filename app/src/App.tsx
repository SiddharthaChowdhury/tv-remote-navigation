import { useEffect, useState } from "react";
import { HomePage } from "./examples/Home.page";
import { View } from "./examples/react-native.components";
import { Modal } from "./examples/Modal";

export const App = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowModal(true);
    }, 5_000);

    setTimeout(() => {
      setShowModal(false);
    }, 10_000);
  }, []);

  return (
    <View style={{ position: "relative", width: "1200px", height: "800px" }}>
      <HomePage grid showModal={showModal} />
      {showModal && <Modal />}
      {/* <Modal /> */}
    </View>
  );
};
