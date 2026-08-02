import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdOutlineRefresh, MdOutlineHistory } from "react-icons/md";
import Button from "../../../components/ui/Button.jsx";
import { ROUTES } from "../../../utils/constants.js";

const ResultActions = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <Button
        onClick={() => navigate(ROUTES.INTERVIEW)}
        className="gap-2"
        size="lg"
      >
        <MdOutlineRefresh size={18} />
        Start New Interview
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate("/dashboard/interview/history")}
        className="gap-2"
        size="lg"
      >
        <MdOutlineHistory size={18} />
        View History
      </Button>
    </motion.div>
  );
};

export default ResultActions;
