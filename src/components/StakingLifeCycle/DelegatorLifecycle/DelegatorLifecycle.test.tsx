import { screen } from "@testing-library/react";
import Router from "react-router";
import DelegatorLifecycle from ".";
import { render } from "../../../test-utils";

describe("DelegatorLifecycle timeline view", () => {
  beforeEach(() => {
    jest.spyOn(Router, "useParams").mockReturnValue({ stakeId: "123" });
  });

  it("should render Registration", () => {
    render(
      <DelegatorLifecycle
        handleResize={jest.fn()}
        containerPosition={{ top: undefined, left: undefined }}
        setMode={jest.fn()}
        currentStep={0}
        setCurrentStep={jest.fn()}
      />
    );
    expect(screen.getByText("Rewards Distribution")).toBeInTheDocument();
    expect(screen.getByText("Rewards Withdrawal")).toBeInTheDocument();
    expect(screen.getByText("Next Step: Delegation")).toBeInTheDocument();
  });

  it("should render Delegation", () => {
    render(
      <DelegatorLifecycle
        handleResize={jest.fn()}
        containerPosition={{ top: undefined, left: undefined }}
        setMode={jest.fn()}
        currentStep={1}
        setCurrentStep={jest.fn()}
      />
    );
    expect(screen.getByText("Previous: Registration")).toBeInTheDocument();
    expect(screen.getByText("Next Step: Rewards Distribution")).toBeInTheDocument();
  });

  it("should render Rewards Distribution", () => {
    render(
      <DelegatorLifecycle
        handleResize={jest.fn()}
        containerPosition={{ top: undefined, left: undefined }}
        setMode={jest.fn()}
        currentStep={2}
        setCurrentStep={jest.fn()}
      />
    );
    expect(screen.getByText("Previous: Delegation")).toBeInTheDocument();
    expect(screen.getByText("Next Step: Rewards Withdrawal")).toBeInTheDocument();
  });


  it("should render Rewards Withdrawal", () => {
    render(
      <DelegatorLifecycle
        handleResize={jest.fn()}
        containerPosition={{ top: undefined, left: undefined }}
        setMode={jest.fn()}
        currentStep={3}
        setCurrentStep={jest.fn()}
      />
    );
    expect(screen.getByText("Previous: Rewards Distribution")).toBeInTheDocument();
    expect(screen.getByText("Next Step: Deregistration")).toBeInTheDocument();
  });

  it("should render Deregistration", () => {
    render(
      <DelegatorLifecycle
        handleResize={jest.fn()}
        containerPosition={{ top: undefined, left: undefined }}
        setMode={jest.fn()}
        currentStep={4}
        setCurrentStep={jest.fn()}
      />
    );
    expect(screen.getByText("Previous: Rewards Withdrawal")).toBeInTheDocument();
  });
});
