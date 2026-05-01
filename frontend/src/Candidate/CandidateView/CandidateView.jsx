import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, Printer, ArrowLeft } from "lucide-react";
import html2pdf from "html2pdf.js";
import logo from "../../assets/MV Logo.png";
import { getCandidateDetailsByID } from "../../apiHandler/candidate";
import { backendUrl } from "../../backendUrl";
import Loader from "../../components/Loader";

// --- Constants & Helper Styles ---
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const CandidateView = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidateDetail, setCandidateDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Fetch candidate data
  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        const response = await getCandidateDetailsByID(candidateId);
        if (response.hasError) throw new Error(response.message || "Failed to fetch candidate data");
        setCandidateDetail(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (candidateId) fetchCandidate();
  }, [candidateId]);

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    const element = document.getElementById("pdf-content");
    const options = {
      margin: [2, 0, 5, 0], // Reduced top margin to make content come 'little up'
      filename: `${candidateDetail?.personalDetail?.name || "Candidate"}_Profile.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { 
        scale: 3, // Increased scale for pixel-perfection
        useCORS: true, 
        letterRendering: true,
        allowTaint: true,
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
      pagebreak: { mode: ["avoid-all", "css"] }
    };

    try {
      // Give the browser a moment to ensure all styles/images are fully painted
      await new Promise(resolve => setTimeout(resolve, 500));
      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loader text="Fetching candidate profile..." />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowLeft size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Occurred</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Go Back</button>
      </div>
    </div>
  );

  const personal = candidateDetail?.personalDetail || {};
  const academics = candidateDetail?.academics?.qualifications || [];
  const career = candidateDetail?.careerProgression?.experiences || [];
  const family = candidateDetail?.familyDetails || {};
  const references = candidateDetail?.references || {};
  const declaration = candidateDetail?.declaration || {};

  // Formatted Date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
      }).toUpperCase();
    } catch (e) { return dateStr; }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 print:p-0 print:bg-white">
      {/* Toolbar - Sticky at top below Navbar */}
      <div className="sticky top-[72px] z-40 w-full mb-8 print:hidden transition-all duration-300">
        <div className="max-w-[210mm] mx-auto px-4 md:px-0">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-slate-500 hover:text-mv-navy font-bold text-sm transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-slate-100 transition-colors">
                <ArrowLeft size={18} />
              </div>
              Back to Database
            </button>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={handleDownloadPdf} 
                disabled={isGeneratingPdf}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-mv-navy text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md shadow-slate-200 disabled:opacity-70 active:scale-95"
              >
                {isGeneratingPdf ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                {isGeneratingPdf ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (Natural Flow) */}
      <div id="pdf-content" className="w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full">
        <div className="print-wrapper">
          <style dangerouslySetInnerHTML={{ __html: `
            .excel-table { 
              width: 100%; 
              border-collapse: collapse; 
              font-family: 'Arial', sans-serif; 
              table-layout: fixed; 
              margin-bottom: 2px; 
              page-break-inside: avoid; 
              break-inside: avoid; 
              box-sizing: border-box;
            }
            .excel-table td, .excel-table th { 
              border: 1px solid #000; 
              padding: 5px 8px; 
              font-size: 7.5pt; 
              vertical-align: middle; 
              min-height: 24px; 
              word-wrap: break-word; 
              position: relative; 
              line-height: 1.2;
              box-sizing: border-box;
            }
            .excel-table th {
              text-align: center;
              font-weight: bold;
            }
            .bg-navy { 
              background-color: #000; 
              color: #fff; 
              font-weight: bold; 
              text-align: center; 
              text-transform: uppercase; 
              padding: 4px 8px;
              font-size: 8.5pt; 
              line-height: 1.1;
            }
            .bg-blue-header { background-color: #DEEBF7; font-weight: bold; padding-left: 8px !important; }
            .text-center { text-align: center !important; }
            .font-bold { font-weight: bold; }
            .header-box { border: 1px solid #000; padding: 3px 6px; text-align: center; }
            .print-wrapper { 
              width: 210mm; 
              margin: 0 auto;
              padding: 8mm 10mm 10mm 10mm; 
              box-sizing: border-box; 
              background: white;
              min-height: 297mm;
            }
            .photo-container {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              background-color: #f9fafb;
            }
            .photo-container img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            @media print {
              .print-wrapper { width: 190mm; padding: 0; margin: 0; }
              body { background: white; }
              .print-hidden { display: none !important; }
              @page { margin: 10mm; }
            }
          `}} />

          {/* Header */}
          <table className="excel-table mb-2">
            <tbody>
              <tr>
                <td colSpan="2" style={{ border: 'none', verticalAlign: 'middle', padding: '5px' }}>
                  <img src={logo} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </td>
                <td colSpan="7" style={{ border: 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: '15pt', fontWeight: 'bold', lineHeight: '1.2' }}>Manjushree Ventures</div>
                  <div style={{ fontSize: '12pt', fontWeight: 'bold', lineHeight: '1.2' }}>Personal Profile Form</div>
                  <div style={{ fontSize: '9pt', fontWeight: '600' }}>Human Resources Department</div>
                </td>
                <td colSpan="2" className="header-box" style={{ fontSize: '7.5pt', textAlign: 'left', border: '1px solid #000' }}>
                  <div className="font-bold">HR-TA-</div>
                  <div className="font-bold">Process 4-</div>
                  <div className="font-bold">Version:09 / Rev:00</div>
                  <div className="font-bold">{formatDate(new Date())}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Note */}
          <table className="excel-table mb-1">
            <tbody>
              <tr>
                <td className="bg-navy" style={{ width: '12%' }}>Note</td>
                <td style={{ fontSize: '7.5pt', padding: '4px 10px' }}>
                  1. All the information asked should be typed without fail. Don't leave any cell blank.<br/>
                  2. After filling all cells, send to us in printable format
                </td>
              </tr>
            </tbody>
          </table>

          {/* Personal Details Header */}
          <table className="excel-table">
            <tbody>
              <tr><td colSpan="11" className="bg-navy">PERSONAL DETAILS</td></tr>
            </tbody>
          </table>

          {/* Personal Details Grid */}
          <table className="excel-table">
            <tbody>
              <tr>
                <td colSpan="2" className="bg-blue-header">Name</td>
                <td colSpan="3">{personal.name || ""}</td>
                <td colSpan="2" className="bg-blue-header" style={{ borderLeft: '1px solid #000' }}>Position Applied</td>
                <td colSpan="4">{personal.positionApplied || ""}</td>
              </tr>
              <tr>
                <td colSpan="2" className="bg-blue-header">Date of Birth</td>
                <td colSpan="1">{formatDate(personal.dateOfBirth)}</td>
                <td colSpan="1" className="bg-blue-header">Age</td>
                <td colSpan="1">{personal.age || ""}</td>
                <td colSpan="2" className="bg-blue-header" style={{ borderLeft: '1px solid #000' }}>e mail ID</td>
                <td colSpan="2" style={{ textAlign: 'left', fontSize: '8pt', wordBreak: 'break-word' }}>{personal.email || ""}</td>
                <td colSpan="2" rowSpan="4" className="text-center" style={{ border: '1px solid #000', padding: '1px' }}>
                  <div className="photo-container" style={{ height: '115px' }}>
                    {personal.photo ? (
                      <img 
                        src={personal.photo.startsWith('http') ? personal.photo : `${backendUrl}${personal.photo}`} 
                        alt="Candidate" 
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div style={{ fontSize: '7pt', color: '#888', padding: '5px' }}>
                        Insert Recent Photograph<br/>(Use JPEG)
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="2" rowSpan="2" className="bg-blue-header">Permanent Residential Address</td>
                <td colSpan="3" rowSpan="2" style={{ fontSize: '8.5pt' }}>{personal.permanentAddress || ""}</td>
                <td colSpan="2" className="bg-blue-header" style={{ borderLeft: '1px solid #000' }}>Phone No</td>
                <td colSpan="2" style={{ textAlign: 'left' }}>{personal.phoneNo || ""}</td>
              </tr>
              <tr>
                <td colSpan="2" className="bg-blue-header" style={{ borderLeft: '1px solid #000' }}>House Ownership (Leased / Own)</td>
                <td colSpan="2">{personal.houseOwnership || ""}</td>
              </tr>
              <tr>
                <td colSpan="2" rowSpan="1" className="bg-blue-header">Present Residential Address</td>
                <td colSpan="3" rowSpan="1" style={{ fontSize: '8.5pt' }}>{personal.presentAddress || ""}</td>
                <td colSpan="2" className="bg-blue-header" style={{ borderLeft: '1px solid #000' }}>Distance to Work location</td>
                <td colSpan="2">{personal.workLocationDistance || ""}</td>
              </tr>
            </tbody>
          </table>

          {/* Languages & Employment Terms - Refactored for 9 Columns */}
          <table className="excel-table mt-4" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '7%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '12.5%' }} />
              <col style={{ width: '12.5%' }} />
            </colgroup>
            <thead>
              <tr>
                <th colSpan="2" className="bg-blue-header">Language Known</th>
                <th className="bg-blue-header">Read</th>
                <th className="bg-blue-header">Speak</th>
                <th className="bg-blue-header">Write</th>
                <th colSpan="2" className="bg-blue-header">Employment Terms</th>
                <th colSpan="2" className="bg-blue-header">Vehicle Ownership (Tick)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-blue-header">Mother Tongue</td>
                <td>{personal.languages?.[0]?.language || ""}</td>
                <td className="text-center">{personal.languages?.[0]?.read ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[0]?.speak ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[0]?.write ? "Yes" : ""}</td>
                <td className="bg-blue-header">Notice Period in days</td>
                <td className="text-center">{personal.noticePeriod || ""}</td>
                <td className="bg-blue-header text-center">2 Wheeler</td>
                <td className="bg-blue-header text-center">4 Wheeler</td>
              </tr>
              <tr>
                <td rowSpan="4" className="bg-blue-header">Other Languages</td>
                <td>{personal.languages?.[1]?.language || ""}</td>
                <td className="text-center">{personal.languages?.[1]?.read ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[1]?.speak ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[1]?.write ? "Yes" : ""}</td>
                <td className="bg-blue-header">Can you join in 30 days</td>
                <td className="text-center">{personal.canJoinIn30Days ? "Yes" : "No"}</td>
                <td className="text-center">{personal.vehicleOwnership?.twoWheeler ? "✓" : ""}</td>
                <td className="text-center">{personal.vehicleOwnership?.fourWheeler ? "✓" : ""}</td>
              </tr>
              <tr>
                <td>{personal.languages?.[2]?.language || ""}</td>
                <td className="text-center">{personal.languages?.[2]?.read ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[2]?.speak ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[2]?.write ? "Yes" : ""}</td>
                <td className="bg-blue-header">Current CTC PA in ₹</td>
                <td className="text-center">{personal.currentCTC || ""}</td>
                <td colSpan="2" className="bg-blue-header text-center">Previous Increment</td>
              </tr>
              <tr>
                <td>{personal.languages?.[3]?.language || ""}</td>
                <td className="text-center">{personal.languages?.[3]?.read ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[3]?.speak ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[3]?.write ? "Yes" : ""}</td>
                <td className="bg-blue-header">Variable Pay PA in ₹</td>
                <td className="text-center">{personal.variablePay || ""}</td>
                <td className="bg-blue-header text-center">%</td>
                <td className="text-center">{personal.previousIncrementPercent || ""}%</td>
              </tr>
              <tr>
                <td>{personal.languages?.[4]?.language || ""}</td>
                <td className="text-center">{personal.languages?.[4]?.read ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[4]?.speak ? "Yes" : ""}</td>
                <td className="text-center">{personal.languages?.[4]?.write ? "Yes" : ""}</td>
                <td className="bg-blue-header">Total CTC PA in ₹</td>
                <td className="text-center">{personal.totalCTC || ""}</td>
                <td className="bg-blue-header text-center">Amount in ₹</td>
                <td className="text-center">{personal.previousIncrementAmount || ""}</td>
              </tr>
            </tbody>
          </table>

          {/* Academics Section */}
          <table className="excel-table mt-4">
            <thead>
              <tr><th colSpan="7" className="bg-navy">ACADEMICS / EDUCATIONAL QUALIFICATION</th></tr>
              <tr>
                <th className="bg-blue-header" style={{ width: '15%' }}>Qualification</th>
                <th className="bg-blue-header" style={{ width: '10%' }}>Year of Passing</th>
                <th className="bg-blue-header" style={{ width: '10%' }}>Regular / Distance</th>
                <th className="bg-blue-header" style={{ width: '15%' }}>Specialisation eg: BE-Mech; DME etc.</th>
                <th className="bg-blue-header" style={{ width: '22%' }}>Name of college</th>
                <th className="bg-blue-header" style={{ width: '20%' }}>University / Board</th>
                <th className="bg-blue-header" style={{ width: '8%' }}>% scored</th>
              </tr>
            </thead>
            <tbody>
              {["Matriculation", "Plus II", "Diploma", "Graduation", "Post-Graduation", "PG Diploma, if any", "Doctorate Studies"].map((level) => {
                const qual = academics.find(q => q.level.includes(level.split(',')[0])) || {};
                return (
                  <tr key={level}>
                    <td className="bg-blue-header">{level}</td>
                    <td className="text-center">{qual.yearOfPassing || ""}</td>
                    <td className="text-center">{qual.mode || ""}</td>
                    <td>{qual.specialization || ""}</td>
                    <td>{qual.college || ""}</td>
                    <td>{qual.university || ""}</td>
                    <td className="text-center">{qual.percentage || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          
          {/* Career Progression Header */}
          <table className="excel-table mt-4">
            <thead>
              <tr><th colSpan="11" className="bg-navy">CAREER PROGRESSION ( BEGIN WITH CURRENT/ LAST SERVED COMPANY)</th></tr>
              <tr style={{ fontSize: '7.5pt' }}>
                <th className="bg-blue-header">Company Name</th>
                <th className="bg-blue-header">Type of Business</th>
                <th className="bg-blue-header">Location</th>
                <th className="bg-blue-header">Company Revenue</th>
                <th className="bg-blue-header">Designation</th>
                <th className="bg-blue-header">Reporting to</th>
                <th className="bg-blue-header">Period From</th>
                <th className="bg-blue-header">Period To</th>
                <th className="bg-blue-header">Total service</th>
                <th className="bg-blue-header">CTC while leaving</th>
                <th className="bg-blue-header">Reason for leaving</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const displayCount = Math.max(career.length || 0, 3);
                return Array.from({ length: displayCount }).map((_, i) => {
                  const exp = career[i] || {};
                  return (
                    <tr key={i} style={{ height: '35px' }}>
                      <td>{exp.companyName || ""}</td>
                      <td>{exp.businessType || ""}</td>
                      <td>{exp.location || ""}</td>
                      <td>{exp.companyRevenue || ""}</td>
                      <td>{exp.designation || ""}</td>
                      <td>{exp.reportingTo || ""}</td>
                      <td className="text-center">{exp.periodFrom || ""}</td>
                      <td className="text-center">{exp.periodTo || ""}</td>
                      <td className="text-center">{exp.totalService || ""}</td>
                      <td>{exp.ctcWhileLeaving || ""}</td>
                      <td style={{ fontSize: '7pt' }}>{exp.reasonForLeaving || ""}</td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
          
          {/* Family Details */}
          <table className="excel-table mt-4">
            <thead>
              <tr><th colSpan="5" className="bg-navy">FAMILY DETAILS</th></tr>
              <tr>
                <th className="bg-blue-header">Family Members</th>
                <th className="bg-blue-header">Name</th>
                <th className="bg-blue-header">Age</th>
                <th className="bg-blue-header">Profession</th>
                <th className="bg-blue-header">Place of residence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-blue-header">Spouse</td>
                <td>{family.spouse?.name || ""}</td>
                <td className="text-center">{family.spouse?.age || ""}</td>
                <td>{family.spouse?.profession || ""}</td>
                <td>{family.spouse?.placeOfResidence || ""}</td>
              </tr>
              <tr>
                <td className="bg-blue-header">Father</td>
                <td>{family.father?.name || ""}</td>
                <td className="text-center">{family.father?.age || ""}</td>
                <td>{family.father?.profession || ""}</td>
                <td>{family.father?.placeOfResidence || ""}</td>
              </tr>
              <tr>
                <td className="bg-blue-header">Mother</td>
                <td>{family.mother?.name || ""}</td>
                <td className="text-center">{family.mother?.age || ""}</td>
                <td>{family.mother?.profession || ""}</td>
                <td>{family.mother?.placeOfResidence || ""}</td>
              </tr>
            </tbody>
          </table>

          {/* Children Sub-table */}
          <table className="excel-table mt-0" style={{ borderTop: 'none' }}>
            <thead>
              <tr>
                <th className="bg-blue-header" style={{ width: '20%' }}>Children</th>
                <th className="bg-blue-header" style={{ width: '30%' }}>Name</th>
                <th className="bg-blue-header" style={{ width: '10%' }}>Age</th>
                <th className="bg-blue-header" style={{ width: '30%' }}>School and Location</th>
                <th className="bg-blue-header" style={{ width: '10%' }}>Class</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => {
                const child = family.children?.[i] || {};
                return (
                  <tr key={i}>
                    <td className="bg-blue-header">Child {i + 1}</td>
                    <td>{child.name || ""}</td>
                    <td className="text-center">{child.age || ""}</td>
                    <td>{child.school || ""}</td>
                    <td className="text-center">{child.class || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* References */}
          <table className="excel-table mt-6">
            <thead>
              <tr><th colSpan="4" className="bg-navy">REFERENCES</th></tr>
              <tr>
                <td colSpan="4" style={{ fontSize: '8pt', fontStyle: 'italic', padding: '10px' }}>
                  Please provide 3 references, such references maybe from your Superior, MD's of large organisations, person of high repute in Society, officials in Civil Services etc. Please do not provide references of any relatives.
                </td>
              </tr>
              <tr>
                <th className="bg-blue-header">Details</th>
                <th className="bg-blue-header">Reference 1</th>
                <th className="bg-blue-header">Reference 2</th>
                <th className="bg-blue-header">Reference 3</th>
              </tr>
            </thead>
            <tbody>
              {["Name", "Designation", "Phone No:", "Email :", "Since how long you know?"].map((label) => {
                const field = label.includes("Name") ? "name" : label.includes("Designation") ? "designation" : label.includes("Phone") ? "phoneNo" : label.includes("Email") ? "email" : "knownSince";
                return (
                  <tr key={label}>
                    <td className="bg-blue-header">{label}</td>
                    <td>{references.referees?.[0]?.[field] || ""}</td>
                    <td>{references.referees?.[1]?.[field] || ""}</td>
                    <td>{references.referees?.[2]?.[field] || ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Verification Questions */}
          <table className="excel-table mt-4">
            <tbody>
              <tr>
                <td colSpan="3" className="bg-blue-header" style={{ borderBottom: 'none' }}>Please confirm whether we can verify your employment details from your current employer?</td>
                <td colSpan="1" className="text-center">{references.canVerifyCurrentEmployer ? "YES" : "NO"}</td>
              </tr>
              <tr>
                <td colSpan="3" className="bg-blue-header">If no, Please explain us why?</td>
                <td colSpan="1">{references.reasonIfNo || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          {/* Declaration */}
          <table className="excel-table mt-4">
            <tbody>
              <tr>
                <td style={{ fontSize: '8.5pt', padding: '15px', lineHeight: '1.4' }}>
                  I hereby declare that the information provided by me are TRUE to my knowledge and belief and if, found FALSE later on at any point of time during course of employment, I am liable to be terminated from employment under the grounds of misconduct without any employment terminal benefits.
                </td>
              </tr>
            </tbody>
          </table>

          {/* Signature */}
          <table className="excel-table mt-4">
            <tbody>
              <tr>
                <td className="bg-blue-header text-center" style={{ width: '50%' }}>Signature<br/><span style={{ fontSize: '7pt', fontWeight: 'normal' }}>Insert JPEG image in the space provided</span></td>
                <td className="text-center">
                  <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {declaration.signature ? (
                      <img 
                        src={declaration.signature.startsWith('http') ? declaration.signature : `${backendUrl}${declaration.signature}`} 
                        alt="Signature" 
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <span style={{ color: '#ccc', fontSize: '8pt' }}>Insert here</span>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default CandidateView;
