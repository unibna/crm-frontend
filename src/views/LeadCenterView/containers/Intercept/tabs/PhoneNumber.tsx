import { useContext } from "react";
import InterceptContainer from "views/LeadCenterView/components/InterceptContainer";
import { LeadSpamContext } from "..";
import { SPAM_TYPE } from "views/LeadCenterView/constants";

type Props = {};

const PhoneNumber = (props: Props) => {
  const context = useContext(LeadSpamContext);
  return <InterceptContainer {...context} spamType={SPAM_TYPE.PHONE} />;
};

export default PhoneNumber;
