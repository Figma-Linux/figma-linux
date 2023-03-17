<script lang="ts">
  import { Flex, Text, SecondaryButton, CheckBox } from "Common";
  import { settings } from "../../../store";

  let display = "block";

  $: display = $settings.app.dontShowTutorialCreator ? "none" : "block";
</script>

<div style={`display: ${display};`}>
  <Flex
    margin="0 0 0 40px"
    height="40px"
    width="-webkit-fill-available"
    bgColor="rgba(0, 0, 0, 0.8)"
  />
  <Flex height="-webkit-fill-available" width="-webkit-fill-available" bgColor="rgba(0, 0, 0, 0.8)">
    <Flex width="200px" padding="2px 0 0 0px">
      <svg
        width="200px"
        height="210"
        viewBox="0 0 324 406"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M321 403C164.779 260.756 52.3246 108.806 13.1149 15.4754M13.1149 15.4754C12.7038 14.1055 12.302 12.7443 11.9094 11.3918C5.04797 -0.275571 5.37766 1.0864 7.09454 10.1764M13.1149 15.4754C11.2008 13.7815 9.20347 12.0176 7.09454 10.1764M13.1149 15.4754C30.6553 30.9987 41.2013 40.6492 66.5116 50.0989M7.09454 10.1764C7.44339 12.0233 7.84945 14.1892 8.26413 16.6296C10.4411 29.4415 10.4225 108.449 8.13556 57.4936C7.86631 51.4944 1.7277 5.53545 3.23906 6.83497C4.56694 7.9767 5.85017 9.09006 7.09454 10.1764Z"
          stroke="white"
          stroke-width="5"
          stroke-linecap="round"
        />
      </svg>
    </Flex>
    <Flex der="column" padding="40px 0 0 0">
      <Flex der="column" padding="0 0 30px 0">
        <Text color="white" size="20px" whiteSpace="wrap" width="450px"
          >Hey! This is the new color palette theme preview.</Text
        >
        <Flex height="10px" />
        <Text whiteSpace="wrap" width="450px"
          >Edit colors and see changes instantly in the previewer. Use the mask at the top to zoom
          and scroll. When the mask is active, you can't interact with Figma UI. To toggle the mask,
          click the button or press Left Alt key.</Text
        >
      </Flex>
      <Flex alignItems="center">
        <Flex padding="0 14px 0 0">
          <Text>Use</Text>
        </Flex>
        <SecondaryButton>Left Alt</SecondaryButton>
        <Flex padding="0 0 0 14px">
          <Text>for toggle mask.</Text>
        </Flex>
      </Flex>
      <Flex alignItems="center" padding="14px 0 0 0">
        <Flex padding="0 14px 0 0">
          <Text>Use</Text>
        </Flex>
        <SecondaryButton>Mouse Wheel</SecondaryButton>
        <Flex padding="0 0 0 14px">
          <Text>for change zoom.</Text>
        </Flex>
      </Flex>
      <Flex alignItems="center" padding="14px 0 0 0">
        <Flex padding="0 14px 0 0">
          <Text>Use</Text>
        </Flex>
        <SecondaryButton>Left Mouse Button</SecondaryButton>
        <Flex padding="0 0 0 14px">
          <Text>for dragging the previewer area.</Text>
        </Flex>
      </Flex>
      <Flex alignItems="center" padding="14px 0 0 0">
        <CheckBox
          bind:checked={$settings.app.dontShowTutorialCreator}
          text="Don't show this tutorial again"
        />
      </Flex>
    </Flex>
  </Flex>
</div>

<style>
  div {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
  }
</style>
