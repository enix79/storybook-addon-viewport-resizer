import React, { FC, FormEvent, memo, useEffect, useState } from "react";

import { AddonPanel, Form, P } from "storybook/internal/components";
import { useStorybookState, useAddonState, useChannel, useStorybookApi, useGlobals } from "storybook/internal/manager-api";
import ControlsSection from "./ControlsSection";

import { ADDON_ID, EVENTS, PARAMETER_KEYS } from "../constants";
import { DEFAULT_STATE } from "../defaults";
import { AddonState } from "src/types";

import { styled } from "storybook/internal/theming";
import { StyledSection } from "./ControlsSection";
import useBreakpoints from "src/hooks/useBreakpoints";

interface PanelProps {
  active: boolean;
}

export const Panel: FC<PanelProps> = memo(function MyPanel(props) {
  if (!props.active) return null;

  const [addonState, setAddonState] = useAddonState<AddonState>(ADDON_ID, DEFAULT_STATE);
  const { state, startWidth, endWidth, currentWidth, step, delay, repeat } = addonState;

  const [inputStartWidth, setInputStartWidth] = useState<number>(startWidth);
  const [inputEndWidth, setInputEndWidth] = useState<number>(endWidth);
  const [inputStep, setInputStep] = useState<number>(step);
  const [inputDelay, setInputDelay] = useState<number>(delay);

  const onInputStartWidthChange = (event: FormEvent<HTMLInputElement>) => setInputStartWidth(Number(event.currentTarget.value));
  const onInputEndWidthChange = (event: FormEvent<HTMLInputElement>) => setInputEndWidth(Number(event.currentTarget.value));
  const onInputStepChange = (event: FormEvent<HTMLInputElement>) => setInputStep(Number(event.currentTarget.value));
  const onInputDelayChange = (event: FormEvent<HTMLInputElement>) => setInputDelay(Number(event.currentTarget.value));

  const emit = useChannel({ UPDATE_WIDTH: () => null });
  const path = useStorybookState().path;

  const api = useStorybookApi();
  const paramStartWidth = api.getCurrentParameter<number>(PARAMETER_KEYS.START_WIDTH);
  const paramEndWidth = api.getCurrentParameter<number>(PARAMETER_KEYS.END_WIDTH);
  const paramStep = api.getCurrentParameter<number>(PARAMETER_KEYS.STEP);
  const paramDelay = api.getCurrentParameter<number>(PARAMETER_KEYS.DELAY);

  useEffect(() => {
    const iframe = document.querySelector("#storybook-preview-iframe") as HTMLElement;
    // TODO: How to unset the width, when the panel is not active?
    // TODO: How to integrate with the viewport addon?
    if (iframe) {
      iframe.style.width = `${currentWidth}px`;
    }
  }, [currentWidth, props.active]);

  useEffect(() => {
    if (paramStartWidth && !isNaN(paramStartWidth)) {
      setAddonState((prev) => ({ ...prev, startWidth: Number(paramStartWidth) }));
      setInputStartWidth(Number(paramStartWidth));
    }
  }, [paramStartWidth]);

  useEffect(() => {
    if (paramEndWidth && !isNaN(paramEndWidth)) {
      setAddonState((prev) => ({ ...prev, endWidth: Number(paramEndWidth) }));
      setInputEndWidth(Number(paramEndWidth));
    }
  }, [paramEndWidth]);

  useEffect(() => {
    if (paramStep && !isNaN(paramStep)) {
      setAddonState((prev) => ({ ...prev, step: Number(paramStep) }));
      setInputStep(Number(paramStep));
    }
  }, [paramStep]);

  useEffect(() => {
    if (paramDelay && !isNaN(paramDelay)) {
      setAddonState((prev) => ({ ...prev, delay: Number(paramDelay) }));
      setInputDelay(Number(paramDelay));
    }
  }, [paramDelay]);

  useEffect(() => {
    setAddonState(DEFAULT_STATE);
  }, [path]);

  const currentBreakpoint = useBreakpoints(currentWidth);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (state === "playing") {
      if (currentWidth >= endWidth) {
        if (repeat) {
          setAddonState((prev) => ({ ...prev, currentWidth: startWidth }));
          emit(EVENTS.UPDATE_WIDTH, startWidth);
        } else {
          setAddonState((prev) => ({ ...prev, state: "paused" }));
        }
      } else {
        const incrementWidth = () =>
          setAddonState((prev) => ({
            ...prev,
            currentWidth: currentWidth + step,
          }));
        emit(EVENTS.UPDATE_WIDTH, currentWidth + step);
        timeoutId = setTimeout(incrementWidth, delay);
      }
      return () => clearTimeout(timeoutId);
    }
  }, [state, currentWidth, startWidth, endWidth, repeat, delay, step]);

  const onPlay = () => {
    if (state === "playing") return;
    setAddonState((prev) => ({ ...prev, state: "playing" }));
  };

  const onPause = () => {
    if (state === "paused") return;
    setAddonState((prev) => ({ ...prev, state: "paused" }));
  };

  const onReset = () => {
    setAddonState((prev) => ({ ...prev, currentWidth: startWidth }));
    emit(EVENTS.UPDATE_WIDTH, startWidth);
  };

  const onToggleRepeat = () => {
    setAddonState((prev) => ({ ...prev, repeat: !prev.repeat }));
  };

  const onSubmitSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddonState((prev) => ({
      ...prev,
      startWidth: inputStartWidth,
      endWidth: inputEndWidth,
      step: inputStep,
      delay: inputDelay,
    }));
  };

  return (
    <AddonPanel {...props}>
      <PanelWrapper>
        <StyledSection>
          <h2>Monitoring</h2>
          <P style={{ marginBlock: "0px", paddingBlock: "2px", minWidth: "150px" }}>{`Current width: ${currentWidth}px`}</P>
          {currentBreakpoint && (
            <P style={{ marginBlock: "0px", paddingBlock: "2px", minWidth: "150px" }}>{`Current breakpoint: ${currentBreakpoint}`}</P>
          )}
        </StyledSection>
        <ControlsSection onPlay={onPlay} onPause={onPause} onReset={onReset} onToggleRepeat={onToggleRepeat} repeat={repeat} />
        <StyledSection>
          <h2>Settings</h2>
          <SettingsForm onSubmit={onSubmitSettings}>
            <Label>
              <LabelContent>Start Width</LabelContent>
              <Form.Input
                type="text"
                name="startWidth"
                value={inputStartWidth}
                onChange={onInputStartWidthChange}
                style={{ width: "60px" }}
              />
            </Label>
            <Label>
              <LabelContent>End Width</LabelContent>
              <Form.Input type="text" name="endWidth" value={inputEndWidth} onChange={onInputEndWidthChange} style={{ width: "60px" }} />
            </Label>
            <Label>
              <LabelContent>Step</LabelContent>
              <Form.Input type="text" name="step" value={inputStep} onChange={onInputStepChange} style={{ width: "60px" }} />
            </Label>
            <Label>
              <LabelContent>Delay</LabelContent>
              <Form.Input type="text" name="delay" value={inputDelay} onChange={onInputDelayChange} style={{ width: "60px" }} />
            </Label>
            <Form.Button type="submit" size="medium" variant="solid" padding="medium" style={{ padding: "8px 40px" }}>
              Apply
            </Form.Button>
          </SettingsForm>
        </StyledSection>
      </PanelWrapper>
    </AddonPanel>
  );
});

const Label = styled.label(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  lineHeight: "16px",
  gap: 8,
}));

const SettingsForm = styled.form(() => ({
  display: "flex",
  columnGap: 16,
  rowGap: 12,
  flexWrap: "wrap",
}));

const LabelContent = styled.span(() => ({}));

const PanelWrapper = styled.div(() => ({
  padding: 12,
  display: "flex",
  flexWrap: "wrap",
  columnGap: 32,
  rowGap: 20,
}));
