import * as React from "react";
import { observer, inject } from "mobx-react";

import "./index.css";
import { Input, List, CheckBox, Text, Button, Icon } from "Elements";
import { Settings } from "Store/Settings";
import ListItems from "./listItems";

interface GeneralBodyProps {
  settings?: Settings;
}

const GeneralBody: React.FunctionComponent<GeneralBodyProps> = props => {
  return (
    <div className="general">
      <div className="section grid grid_1x3">
        <div>
          <Text type="subtitle">Scale UI</Text>
          <Input
            readonlyInput
            value={Math.round(props.settings.settings.ui.scaleFigmaUI * 100)}
            type="range"
            className="justify__content_center"
            displayValue
            suffix="%"
            min={50}
            max={150}
            step={5}
            onChange={(e, d) => props.settings.updateFigmaUiScale(d)}
          />
        </div>
        <div></div>
        <div>
          <Text type="subtitle">Scale Tabs</Text>
          <Input
            readonlyInput
            value={Math.round(props.settings.settings.ui.scalePanel * 100)}
            type="range"
            className="justify__content_center"
            displayValue
            suffix="%"
            min={50}
            max={150}
            step={5}
            onChange={(e, d) => props.settings.updatePanelScale(d)}
          />
        </div>
      </div>
      <div className="section grid grid_1x3">
        <div>
          <Text type="subtitle">Main settings</Text>
          <CheckBox
            value={props.settings.settings.app.saveLastOpenedTabs}
            text="Save the last opened tabs"
            onChange={props.settings.saveLastOpenedTabs}
          />
          <CheckBox
            value={props.settings.settings.app.enableColorSpaceSrgb}
            text="Enable color space sRGB"
            onChange={props.settings.enableColorSpaceSrgb}
          />
          <CheckBox
            value={props.settings.settings.app.visibleNewProjectBtn}
            text="Show new project button"
            onChange={props.settings.visibleNewProjectBtn}
          />
          <CheckBox
            value={props.settings.settings.app.useZenity}
            text="Use Zenity for Dialogs"
            onChange={props.settings.changeUseZenity}
          />
          <CheckBox
            value={props.settings.settings.app.disableThemes}
            text="Disable themes"
            onChange={props.settings.changeDisableThemes}
          />
        </div>
        <div></div>
        <div className="flex flex_column">
          <Text type="subtitle">Export files to</Text>
          <div className="flex align_items_center">
            <Input
              type="text"
              className="justify__content_left flex_grow_1 input_inline border_light input_w_70per marg_right_10px"
              contentBefore={
                <Button
                  className="button_clear"
                  onClick={(): void => {
                    props.settings.selectExportDir();
                  }}
                >
                  <Icon color="var(--text)" size="22" type="Folder" />
                </Button>
              }
              value={props.settings.settings.app.exportDir}
              onChange={(e): void => props.settings.inputExportDir(e.target.value)}
            />
            <Button
              text="Change"
              type="primary"
              className="width_60px"
              onClick={(): void => {
                props.settings.selectExportDir();
              }}
            />
          </div>
        </div>
      </div>
      <div className="section section_end grid grid_1x3">
        <div>
          <Text type="subtitle">Font directories</Text>
          <div className="flex flex_column border_light pad_left_10px pad_top_10px">
            <Button
              type="primary"
              text="+ Add directory"
              className="width_120px"
              onClick={(): void => {
                props.settings.addDir();
              }}
            />
            <List>
              <ListItems items={props.settings.settings.app.fontDirs} onRemove={props.settings.removeDir} />
            </List>
          </div>
        </div>
        <div></div>
        <div>
          {/* <Text type="subtitle">
            UI font
          </Text>
          <ComboBox className="border_light" items={["Inter", "Huinter", "Times New Roman", "Font Hueta"]} /> */}
        </div>
      </div>
    </div>
  );
};

export default inject("settings")(observer(GeneralBody));
