import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  LayoutGrid, 
  List, 
  Trash2, 
  Eye, 
  Briefcase, 
  Clock,
  User,
  AlertCircle,
  Phone,
  Mail,
  IndianRupee,
  FileText,
  Edit
} from "lucide-react";

// --- Backend Imports ---
import { getAllCandidatesList, deleteSingleCandidate, getCandidateDetailsByID } from "../../apiHandler/candidate";
import { setCandidateData, resetCandidateForm } from "../../redux/slices/candidatesSlice";
import { useDispatch } from "react-redux";
import { backendUrl } from "../../backendUrl";
import logo from '../../assets/MV Logo.png';
import Loader from "../../components/Loader";
import { CandidateCardSkeleton } from "../../components/Skeleton";

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// --- Smart Avatar Component ---
const CandidateAvatar = ({ src, name, size = "md" }) => {
  const [imgError, setImgError] = useState(false);
  
  const dims = size === "lg" ? "w-20 h-20 text-2xl" : "w-12 h-12 text-lg";
  
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  return (
    <div className={`${dims} rounded-xl flex-shrink-0 overflow-hidden border-2 border-slate-100 shadow-sm relative bg-slate-100 group-hover:border-mv-navy transition-colors duration-300`}>
      {!imgError && src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold tracking-wider">
          {initials}
        </div>
      )}
    </div>
  );
};

const AllCandidateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // --- State ---
  const [candidateList, setCandidateList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  
  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFetchingFullData, setIsFetchingFullData] = useState(false);

  // --- Fetch Data ---
  const fetchAllCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllCandidatesList();
      if (response.hasError) {
        setError(response.message || "Failed to fetch candidates");
      } else {
        setCandidateList(response.data);
      }
    } catch (err) {
      setError("Connection failed. Please check your network.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCandidates();
  }, [fetchAllCandidates]);

  // --- Filter Logic ---
  const filteredCandidates = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return candidateList;

    return candidateList.filter(c => {
      const name = c?.personalDetail?.name?.toLowerCase() || "";
      const pos = c?.personalDetail?.positionApplied?.toLowerCase() || "";
      return name.includes(query) || pos.includes(query);
    });
  }, [candidateList, searchQuery]);

  // --- Actions ---
  const handleView = (id) => navigate(`/candidate-view/${id}`);
  
  const handleEdit = async (candidate) => {
    const id = candidate.contactDetail?._id || candidate._id;
    setIsFetchingFullData(true);
    try {
      const response = await getCandidateDetailsByID(id);
      if (response && !response.hasError) {
        dispatch(setCandidateData({
          ...response.data,
          isEditMode: true,
          candidateId: id
        }));
        navigate("/new-candidate");
      } else {
        setError("Could not load full profile data for editing.");
      }
    } catch (err) {
      setError("Error loading candidate profile.");
    } finally {
      setIsFetchingFullData(false);
    }
  };

  const handleAddNew = () => {
    dispatch(resetCandidateForm());
    navigate("/new-candidate");
  };
  
  const handleDeleteClick = (id, name) => setDeleteModal({ show: true, id, name });

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      const response = await deleteSingleCandidate(deleteModal.id);
      if (!response.hasError) {
        setCandidateList(prev => prev.filter(c => (c.contactDetail?._id || c._id) !== deleteModal.id));
        setDeleteModal({ show: false, id: null, name: "" });
      } else {
        setError(response.message || "Failed to delete.");
      }
    } catch (e) {
      setError("Error deleting candidate.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* --- Toolbar --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-mv-navy tracking-tight mb-2">Candidate Database</h1>
            <p className="text-slate-500 font-medium flex items-center">
              <FileText size={16} className="mr-2" />
              {isLoading ? 'Synchronizing database...' : `${filteredCandidates.length} Active Records`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mv-navy focus:border-transparent shadow-sm transition-all text-sm"
              />
            </div>

            {/* View Mode */}
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid" 
                    ? "bg-mv-navy text-white shadow-md" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list" 
                    ? "bg-mv-navy text-white shadow-md" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- Error --- */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-100 text-mv-red rounded-xl flex items-center gap-3 text-sm font-semibold shadow-sm"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Data Fetch Loader */}
        <AnimatePresence>
          {isFetchingFullData && (
            <Loader fullScreen={true} text="Loading full profile for editing..." />
          )}
        </AnimatePresence>

        {/* --- Main Content --- */}
        {isLoading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-4"}>
            {[...Array(8)].map((_, i) => (
              <CandidateCardSkeleton key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredCandidates.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-mv-navy">No results found</h3>
                <p className="text-slate-400 text-sm mt-1">Try refining your search terms.</p>
              </motion.div>
            ) : (
              <motion.div 
                key={viewMode}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                    : "flex flex-col gap-4"
                }
              >
                {filteredCandidates.map((candidate) => (
                  <CandidateCard 
                    key={candidate.contactDetail?._id || candidate._id}
                    data={candidate}
                    viewMode={viewMode}
                    onView={() => handleView(candidate.contactDetail?._id || candidate._id)}
                    onEdit={() => handleEdit(candidate)}
                    onDelete={() => handleDeleteClick(candidate.contactDetail?._id || candidate._id, candidate?.personalDetail?.name)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* --- Delete Confirmation Modal --- */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteModal({ show: false, id: null, name: "" })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative z-10 border border-slate-100"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 text-mv-red rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-mv-navy mb-2">Delete Record</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  Are you sure you want to remove <span className="font-bold text-slate-900">{deleteModal.name}</span>? This action is permanent.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeleteModal({ show: false, id: null, name: "" })}
                    className="py-3.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="py-3.5 bg-mv-red text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 text-sm disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CandidateCard = ({ data, viewMode, onView, onDelete, onEdit }) => {
  const { personalDetail, careerProgression } = data;
  const photoUrl = personalDetail?.photo 
    ? personalDetail.photo.startsWith('http') 
        ? personalDetail.photo  // already a full Cloudinary URL
        : `${backendUrl}${personalDetail.photo}` // old local path fallback
    : null;
  
  const name = personalDetail?.name || "Unknown Candidate";
  const role = personalDetail?.positionApplied || "Position Not Specified";
  
  // Calculate combined total experience with support for "X yrs Y months"
  const exp = useMemo(() => {
    const experiences = careerProgression?.experiences || [];
    if (experiences.length === 0) return "0";
    
    let totalMonths = 0;
    
    experiences.forEach(curr => {
      const str = (curr.totalService || "").toLowerCase();
      
      // 1. Extract Years (matches "3", "3 yrs", "3.5 years", etc.)
      const yearMatch = str.match(/(\d+\.?\d*)\s*(?:yr|year)/);
      if (yearMatch) {
        totalMonths += parseFloat(yearMatch[1]) * 12;
      } else {
        // If no "year" keyword, check if it's just a raw number (assume years)
        const rawMatch = str.match(/^\s*(\d+\.?\d*)\s*$/);
        if (rawMatch) totalMonths += parseFloat(rawMatch[1]) * 12;
      }
      
      // 2. Extract Months (matches "8", "8 mo", "8 months", etc.)
      const monthMatch = str.match(/(\d+\.?\d*)\s*(?:mo|month)/);
      if (monthMatch) {
        totalMonths += parseFloat(monthMatch[1]);
      }
    });
    
    if (totalMonths === 0) return "0";
    
    const years = Math.floor(totalMonths / 12);
    const months = Math.round(totalMonths % 12);
    
    let result = "";
    if (years > 0) result += `${years} yrs`;
    if (months > 0) result += `${result ? ' ' : ''}${months} mos`;
    
    return result || "0";
  }, [careerProgression]);

  const email = personalDetail?.email || "";
  const canJoin = personalDetail?.canJoinIn30Days;

  // --- LIST VIEW ---
  if (viewMode === 'list') {
    return (
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-mv-navy transition-all flex flex-col md:flex-row items-center gap-6"
      >
        <CandidateAvatar src={photoUrl} name={name} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="text-lg font-bold text-mv-navy truncate">{name}</h4>
            {canJoin && (
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded border border-emerald-100">
                Immediate
              </span>
            )}
          </div>
          <p className="text-slate-500 font-semibold text-sm mb-3">{role}</p>
          
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-slate-300" /> {exp}</span>
            <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-300" /> {email}</span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={onView}
            className="flex-1 md:flex-none px-6 py-2.5 bg-mv-navy text-white rounded-xl font-bold text-sm shadow-sm hover:bg-slate-800 transition-colors"
          >
            Details
          </button>
          <button 
            onClick={onEdit}
            className="p-2.5 text-slate-400 hover:text-mv-navy hover:bg-blue-50 rounded-xl transition-all"
          >
            <Edit size={20} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2.5 text-slate-400 hover:text-mv-red hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </motion.div>
    );
  }

  // --- GRID VIEW ---
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
    >
      <div className="flex flex-col items-center text-center flex-1">
        <CandidateAvatar src={photoUrl} name={name} size="lg" />
        
        <h3 className="text-xl font-bold text-mv-navy mt-6 mb-1 line-clamp-1 w-full px-2" title={name}>{name}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">{role}</p>

        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Experience</p>
            <p className="text-mv-navy font-bold text-sm">{exp}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Availability</p>
            <p className={`text-sm font-bold ${canJoin ? 'text-emerald-600' : 'text-slate-500'}`}>
              {canJoin ? 'Immediate' : 'Notice'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-50">
        <button 
          onClick={onView}
          className="flex-1 bg-mv-navy text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <Eye size={16} /> View Profile
        </button>
        <button 
          onClick={onEdit}
          className="p-3 text-slate-300 hover:text-mv-navy hover:bg-blue-50 rounded-xl transition-all"
          title="Edit Record"
        >
          <Edit size={20} />
        </button>
        <button 
          onClick={onDelete}
          className="p-3 text-slate-300 hover:text-mv-red hover:bg-red-50 rounded-xl transition-all"
          title="Delete Record"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default AllCandidateList;