import { useState, useEffect } from 'react';
import { SegmentedControl } from './components/baseline/SegmentedControl';
import { Slider } from './components/baseline/Slider';
import { Footer } from './components/baseline/Footer';
import { Tutorial } from './components/baseline/Tutorial';
import { Tooltip } from './components/baseline/Tooltip';
import { Alert } from './components/baseline/Alert';
import { LanguageProvider } from './components/LanguageProvider';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyModal } from './components/PrivacyModal';
import { TermsModal } from './components/TermsModal';
import { supabase } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { getFullDeviceIdentifier } from './utils/deviceFingerprint';
import svgPathsHeader from './imports/svg-zfr6dv619b';
import svgPathsKey from './imports/svg-5zjx8yvqux';
import { RotateCcw, LogOut, User, Eye, EyeOff, Info, X } from 'lucide-react';

export default function App() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalClosing, setAuthModalClosing] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalClosing, setUpgradeModalClosing] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  
  // Privacy and Terms modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacyModalClosing, setPrivacyModalClosing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsModalClosing, setTermsModalClosing] = useState(false);
  
  // Preview mode calculation tracking for non-logged users
  const [previewCalculations, setPreviewCalculations] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baseline_preview_calculations');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  
  // Feedback states
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWarningMessage, setShowWarningMessage] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Project context state
  const [projectType, setProjectType] = useState('brand');
  const [workSize, setWorkSize] = useState(1);
  const [timelinePressure, setTimelinePressure] = useState('normal');
  const [revisionsModel, setRevisionsModel] = useState('fixed');

  // Freelancer context state
  const [experienceBand, setExperienceBand] = useState('intermediate');
  const [capacityPressure, setCapacityPressure] = useState(0);

  // Recap visibility state
  const [showRecap, setShowRecap] = useState(false);
  
  // Tutorial visibility state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialClosing, setTutorialClosing] = useState(false);

  // Track if inputs have changed since last calculation
  const [inputsChanged, setInputsChanged] = useState(false);
  
  // Store the displayed result (only updates when "Get Results" is clicked)
  const [displayedResult, setDisplayedResult] = useState<any>(null);
  const [lastCalculatedState, setLastCalculatedState] = useState<string>('');

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [basePrice, setBasePrice] = useState(800);
  
  // Custom multipliers
  const [customMultipliers, setCustomMultipliers] = useState({
    brand: 1.0,
    uxui: 1.2,
    product: 1.25,
    '3dMotion': 1.15,
    illustration: 1.0,
    strategy: 1.3,
    webDev: 1.3,
    sizeSmall: 1.2,
    sizeMedium: 1.3,
    sizeLarge: 1.4,
    sizeExtra: 1.5,
    timelineNormal: 1.0,
    timelineCompressed: 1.15,
    timelineRush: 1.3,
    revisionsFixed: 1.0,
    revisionsOpen: 1.1,
    experienceJunior: 1.0,
    experienceIntermediate: 1.25,
    experienceSenior: 1.5,
    capacityOpen: 1.0,
    capacityLimited: 1.1,
    capacityFull: 1.2
  });

  // Load user session from Supabase
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          hasFullAccess: session.user.user_metadata?.hasFullAccess || false,
          calculationsUsed: session.user.user_metadata?.calculationsUsed || 0
        };
        setIsLoggedIn(true);
        setUserInfo(userData);
        
        // Clear preview calculations when session exists
        localStorage.removeItem('baseline_preview_calculations');
        setPreviewCalculations(0);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          hasFullAccess: session.user.user_metadata?.hasFullAccess || false,
          calculationsUsed: session.user.user_metadata?.calculationsUsed || 0
        };
        setIsLoggedIn(true);
        setUserInfo(userData);
        
        // Clear preview calculations when auth state changes to logged in
        localStorage.removeItem('baseline_preview_calculations');
        setPreviewCalculations(0);
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show success message with auto-hide
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 4000);
  };

  // Show error message with auto-hide
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setTimeout(() => setShowErrorMessage(false), 4000);
  };

  // Show warning message with auto-hide (yellow)
  const showWarning = (message: string) => {
    setWarningMessage(message);
    setShowWarningMessage(true);
    setTimeout(() => setShowWarningMessage(false), 4000);
  };

  // Close auth modal with animation
  const closeAuthModal = () => {
    setAuthModalClosing(true);
    setTimeout(() => {
      setShowAuthModal(false);
      setAuthModalClosing(false);
    }, 200);
  };

  // Close upgrade modal with animation
  const closeUpgradeModal = () => {
    setUpgradeModalClosing(true);
    setTimeout(() => {
      setShowUpgradeModal(false);
      setUpgradeModalClosing(false);
    }, 200);
  };

  // Close privacy modal with animation
  const closePrivacyModal = () => {
    setPrivacyModalClosing(true);
    setTimeout(() => {
      setShowPrivacyModal(false);
      setPrivacyModalClosing(false);
    }, 200);
  };

  // Close terms modal with animation
  const closeTermsModal = () => {
    setTermsModalClosing(true);
    setTimeout(() => {
      setShowTermsModal(false);
      setTermsModalClosing(false);
    }, 200);
  };

  // Toggle tutorial with animation
  const toggleTutorial = () => {
    if (showTutorial) {
      setTutorialClosing(true);
      setTimeout(() => {
        setShowTutorial(false);
        setTutorialClosing(false);
      }, 200);
    } else {
      setShowTutorial(true);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          hasFullAccess: data.user.user_metadata?.hasFullAccess || false,
          calculationsUsed: data.user.user_metadata?.calculationsUsed || 0
        };

        setUserInfo(userData);
        setIsLoggedIn(true);
        setAuthLoading(false);
        
        // Clear preview calculations when logging in
        localStorage.removeItem('baseline_preview_calculations');
        setPreviewCalculations(0);
        
        closeAuthModal();
        showSuccess(`Welcome back, ${userData.name}!`);
      }
    } catch (error: any) {
      setAuthLoading(false);
      showError(error.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const handleSignup = async (email: string, password: string, name: string, licenseKey: string) => {
    setAuthLoading(true);
    
    try {
      console.log('Attempting signup with:', { email, name, hasLicenseKey: !!licenseKey });
      
      // Get device fingerprint
      const deviceFingerprint = getFullDeviceIdentifier();
      
      // Track device signup
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a15ad91a/track-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          deviceFingerprint,
          action: 'signup'
        })
      });
      
      // Use server endpoint for signup to handle license validation and email confirmation
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a15ad91a/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split('@')[0],
          licenseKey: licenseKey.trim() || null,
          deviceFingerprint
        })
      });

      console.log('Signup response status:', response.status);
      
      let result;
      try {
        const responseText = await response.text();
        console.log('Signup response text:', responseText);
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse signup response as JSON:', parseError);
        throw new Error(`Server returned invalid response (${response.status}). Please try again.`);
      }
      
      console.log('Signup result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account');
      }

      if (result.success && result.user) {
        // Now sign in with the created credentials
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw signInError;
        }

        const userData = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          hasFullAccess: result.user.hasFullAccess,
          calculationsUsed: result.user.calculationsUsed
        };

        setUserInfo(userData);
        setIsLoggedIn(true);
        setAuthLoading(false);
        
        // Clear preview calculations when signing up
        localStorage.removeItem('baseline_preview_calculations');
        setPreviewCalculations(0);
        
        closeAuthModal();
        
        if (userData.hasFullAccess) {
          showSuccess(`Account created with Full Access! Welcome, ${userData.name}!`);
        } else {
          showSuccess(`Account created! You have 5 free calculations. Welcome, ${userData.name}!`);
        }
      }
    } catch (error: any) {
      setAuthLoading(false);
      console.error('Signup error:', error);
      showError(error.message || 'Failed to create account. Please try again.');
    }
  };

  const handleForgotPassword = async (email: string) => {
    setAuthLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        throw error;
      }

      setAuthLoading(false);
      closeAuthModal();
      showSuccess('Password reset link sent to your email!');
    } catch (error: any) {
      setAuthLoading(false);
      showError(error.message || 'Failed to send reset link. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserInfo(null);
      resetAll();
      showSuccess('Logged out successfully');
    } catch (error: any) {
      showError(error.message || 'Failed to log out');
    }
  };

  const handleUpgrade = async (licenseKey: string) => {
    if (!licenseKey.trim()) {
      showError('Please enter a license key');
      return;
    }

    try {
      // Check for active session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Session check:', { hasSession: !!session, sessionError, userId: session?.user?.id });
      
      if (!session || sessionError) {
        showError('Your session has expired. Please log in again to upgrade your account.');
        closeUpgradeModal();
        setShowAuthModal(true);
        setIsLoggedIn(false);
        setUserInfo(null);
        return;
      }

      // Refresh the session to ensure we have a valid, up-to-date token
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      console.log('Session refresh:', { 
        hasRefreshedSession: !!refreshedSession, 
        refreshError,
        refreshErrorMessage: refreshError?.message,
        userId: refreshedSession?.user?.id,
        hasAccessToken: !!refreshedSession?.access_token,
        accessTokenLength: refreshedSession?.access_token?.length
      });

      // Use refreshed session or fall back to original
      const activeSession = refreshedSession || session;

      if (!activeSession) {
        showError('Unable to verify your session. Please log in again.');
        closeUpgradeModal();
        setShowAuthModal(true);
        setIsLoggedIn(false);
        setUserInfo(null);
        return;
      }

      console.log('Using session for upgrade:', {
        isRefreshed: !!refreshedSession,
        userId: activeSession.user?.id,
        userEmail: activeSession.user?.email,
        tokenPrefix: activeSession.access_token?.substring(0, 50),
        tokenLength: activeSession.access_token?.length
      });

      console.log('Calling upgrade endpoint with license key:', licenseKey.trim());

      // Call server endpoint to upgrade account
      // Note: Use publicAnonKey for edge function authorization, pass user token in the body
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a15ad91a/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'x-user-token': activeSession.access_token
        },
        body: JSON.stringify({ 
          licenseKey: licenseKey.trim(),
          userToken: activeSession.access_token
        })
      });

      console.log('Raw response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      });

      let result;
      try {
        const responseText = await response.text();
        console.log('Response text:', responseText);
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid response (${response.status}). Please try again.`);
      }
      
      console.log('Upgrade response status:', response.status);
      console.log('Upgrade response result:', result);

      if (!response.ok) {
        // Log the full error for debugging
        console.error('Upgrade failed:', {
          status: response.status,
          error: result.error,
          details: result.details
        });

        // Provide more specific error messages
        if (response.status === 400) {
          throw new Error(result.error || 'Invalid license key. Please check your key and try again.');
        } else if (response.status === 401) {
          // Include server error details for better debugging
          const errorMsg = result.details 
            ? `${result.error || 'Authentication failed'}. ${result.details}`
            : result.error || 'Authentication failed. Please log in again.';
          throw new Error(errorMsg);
        } else if (response.status === 404) {
          throw new Error('User account not found. Please contact support.');
        }
        throw new Error(result.error || 'Failed to upgrade account');
      }

      if (result.success) {
        // Also update user metadata in Supabase auth
        await supabase.auth.updateUser({
          data: {
            hasFullAccess: true,
            licenseKey: licenseKey.trim()
          }
        });

        const updatedUser = {
          ...userInfo,
          hasFullAccess: true
        };
        setUserInfo(updatedUser);
        closeUpgradeModal();
        showSuccess('Account upgraded to Full Access! 🎉');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      showError(error.message || 'Invalid license key. Please check and try again.');
    }
  };

  const resetToDefaults = () => {
    setBasePrice(800);
    setCustomMultipliers({
      brand: 1.0,
      uxui: 1.2,
      product: 1.25,
      '3dMotion': 1.15,
      illustration: 1.0,
      strategy: 1.3,
      webDev: 1.3,
      sizeSmall: 1.2,
      sizeMedium: 1.3,
      sizeLarge: 1.4,
      sizeExtra: 1.5,
      timelineNormal: 1.0,
      timelineCompressed: 1.15,
      timelineRush: 1.3,
      revisionsFixed: 1.0,
      revisionsOpen: 1.1,
      experienceJunior: 1.0,
      experienceIntermediate: 1.25,
      experienceSenior: 1.5,
      capacityOpen: 1.0,
      capacityLimited: 1.1,
      capacityFull: 1.2
    });
    showSuccess('Advanced options reset to defaults');
  };

  const resetAll = () => {
    setProjectType('brand');
    setWorkSize(1);
    setTimelinePressure('normal');
    setRevisionsModel('fixed');
    setExperienceBand('intermediate');
    setCapacityPressure(0);
    setShowRecap(false);
    setShowAdvanced(false);
    setInputsChanged(false);
    setLastCalculatedState('');
    resetToDefaults();
    showSuccess('All inputs reset to defaults');
  };

  const calculateBaseline = () => {
    const typeMultipliers: Record<string, number> = {
      'brand': customMultipliers.brand,
      'ux-ui': customMultipliers.uxui,
      'product': customMultipliers.product,
      '3d-motion': customMultipliers['3dMotion'],
      'illustration': customMultipliers.illustration,
      'strategy': customMultipliers.strategy,
      'web-dev': customMultipliers.webDev
    };
    
    const sizeMultipliers = [
      customMultipliers.sizeSmall, 
      customMultipliers.sizeMedium, 
      customMultipliers.sizeLarge, 
      customMultipliers.sizeExtra
    ];
    
    const timelineMultipliers: Record<string, number> = {
      'normal': customMultipliers.timelineNormal,
      'compressed': customMultipliers.timelineCompressed,
      'rush': customMultipliers.timelineRush
    };
    
    const revisionsMultipliers: Record<string, number> = {
      'fixed': customMultipliers.revisionsFixed,
      'open': customMultipliers.revisionsOpen
    };
    
    const experienceMultipliers: Record<string, number> = {
      'junior': customMultipliers.experienceJunior,
      'intermediate': customMultipliers.experienceIntermediate,
      'senior': customMultipliers.experienceSenior
    };
    
    const capacityMultipliers = [
      customMultipliers.capacityOpen, 
      customMultipliers.capacityLimited, 
      customMultipliers.capacityFull
    ];
    
    const total = basePrice * 
      typeMultipliers[projectType] * 
      sizeMultipliers[workSize] * 
      timelineMultipliers[timelinePressure] * 
      revisionsMultipliers[revisionsModel] * 
      experienceMultipliers[experienceBand] * 
      capacityMultipliers[capacityPressure];
    
    return {
      total: Math.round(total),
      breakdown: {
        projectType: typeMultipliers[projectType],
        workSize: sizeMultipliers[workSize],
        timelinePressure: timelineMultipliers[timelinePressure],
        revisionsModel: revisionsMultipliers[revisionsModel],
        experienceBand: experienceMultipliers[experienceBand],
        capacityPressure: capacityMultipliers[capacityPressure]
      }
    };
  };

  const result = calculateBaseline();

  const projectTypeLabels: Record<string, string> = {
    'brand': 'Brand',
    'ux-ui': 'UX/UI',
    'product': 'Product design',
    '3d-motion': '3D & motion',
    'illustration': 'Illustration',
    'strategy': 'Strategy & consulting',
    'web-dev': 'Web development'
  };

  const workSizeLabels = ['Small', 'Medium', 'Large', 'Extra'];
  const timelinePressureLabels: Record<string, string> = {
    'normal': 'Normal',
    'compressed': 'Compressed',
    'rush': 'Rush'
  };
  const revisionsLabels: Record<string, string> = {
    'fixed': 'Fixed',
    'open': 'Open'
  };
  const experienceLabels: Record<string, string> = {
    'junior': 'Junior',
    'intermediate': 'Intermediate',
    'senior': 'Senior'
  };
  const capacityLabels = ['Open', 'Limited', 'Full'];

  const handleGetResults = () => {
    // Check if logged in and if user has calculations remaining
    if (isLoggedIn && userInfo) {
      if (!userInfo.hasFullAccess && userInfo.calculationsUsed >= 5) {
        setShowUpgradeModal(true);
        return;
      }

      // Increment calculation count for free users
      if (!userInfo.hasFullAccess) {
        const updatedUser = {
          ...userInfo,
          calculationsUsed: userInfo.calculationsUsed + 1
        };
        setUserInfo(updatedUser);
        
        // Update calculation count in Supabase
        supabase.auth.updateUser({
          data: {
            calculationsUsed: updatedUser.calculationsUsed
          }
        }).catch(err => console.error('Failed to update calculation count:', err));
        
        const remaining = 5 - updatedUser.calculationsUsed;
        if (remaining > 0) {
          showSuccess(`Calculation complete! ${remaining} calculation${remaining === 1 ? '' : 's'} remaining`);
        } else {
          showSuccess('Calculation complete! This was your last free calculation');
        }
      } else {
        showSuccess('Baseline calculated successfully!');
      }
    } else {
      // Not logged in - track preview calculations (limited to 5)
      if (previewCalculations >= 5) {
        showWarning('You\'ve used all 5 preview calculations. Sign up to continue!');
        setAuthView('signup');
        setShowAuthModal(true);
        return;
      }
      
      const newCount = previewCalculations + 1;
      setPreviewCalculations(newCount);
      const remaining = Math.max(0, 5 - newCount);
      
      // Track device usage for preview mode
      const deviceFingerprint = getFullDeviceIdentifier();
      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a15ad91a/track-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          deviceFingerprint,
          action: 'calculate'
        })
      }).catch(err => console.error('Failed to track device:', err));
      
      if (remaining > 0) {
        showWarning(`Baseline calculated! You have ${remaining} free calculation${remaining === 1 ? '' : 's'} remaining. Sign up to continue!`);
      } else {
        showWarning('You\'ve used all 5 preview calculations. Sign up to continue!');
      }
    }

    // Save the current result for display
    const currentResult = calculateBaseline();
    setDisplayedResult(currentResult);
    
    setShowRecap(true);
    setInputsChanged(false);
    const currentState = JSON.stringify({
      projectType,
      workSize,
      timelinePressure,
      revisionsModel,
      experienceBand,
      capacityPressure,
      basePrice,
      customMultipliers
    });
    setLastCalculatedState(currentState);

    setTimeout(() => {
      document.getElementById('recap-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        if (showAuthModal) {
          setAuthModalClosing(true);
          setTimeout(() => {
            setShowAuthModal(false);
            setAuthModalClosing(false);
          }, 200);
        } else if (showUpgradeModal) {
          setUpgradeModalClosing(true);
          setTimeout(() => {
            setShowUpgradeModal(false);
            setUpgradeModalClosing(false);
          }, 200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAuthModal, showUpgradeModal]);

  // Persist preview calculations to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoggedIn) {
      localStorage.setItem('baseline_preview_calculations', previewCalculations.toString());
    }
  }, [previewCalculations, isLoggedIn]);

  // Track input changes
  useEffect(() => {
    if (showRecap && lastCalculatedState) {
      const currentState = JSON.stringify({
        projectType,
        workSize,
        timelinePressure,
        revisionsModel,
        experienceBand,
        capacityPressure,
        basePrice,
        customMultipliers
      });
      if (currentState !== lastCalculatedState) {
        setInputsChanged(true);
      }
    }
  }, [projectType, workSize, timelinePressure, revisionsModel, experienceBand, capacityPressure, basePrice, customMultipliers, showRecap, lastCalculatedState]);

  return (
    <LanguageProvider>
      <div className="bg-white min-h-screen font-['Inter']">
      {/* Success/Error Toast Messages */}
      {showSuccessMessage && (
        <div className="fixed top-[24px] right-[24px] z-[100] animate-slide-in-right max-w-[400px]">
          <Alert type="success">
            {successMessage}
          </Alert>
        </div>
      )}

      {showErrorMessage && (
        <div className="fixed top-[24px] right-[24px] z-[100] animate-slide-in-right max-w-[400px]">
          <Alert type="error">
            {errorMessage}
          </Alert>
        </div>
      )}

      {showWarningMessage && (
        <div className="fixed top-[24px] right-[24px] z-[100] animate-slide-in-right max-w-[400px]">
          <Alert type="info">
            {warningMessage}
          </Alert>
        </div>
      )}

      <div className="max-w-[909px] mx-auto px-[20px] py-[64px] lg:py-[80px]">
        {/* Header */}
        <div className="flex flex-col gap-[18px] mb-[64px]">
          {/* Title Section with Auth Buttons */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-[16px]">
            {/* Auth Buttons - First on mobile, last on desktop */}
            {!isLoggedIn ? (
              <div className="flex gap-[8px] items-start order-1 sm:order-2">
                <button
                  onClick={() => {
                    setAuthView('login');
                    setShowAuthModal(true);
                  }}
                  className="bg-white text-black border border-[rgba(0,0,0,0.1)] rounded-[8px] py-[8px] px-[16px] font-['Inter'] font-normal text-[13px] leading-[20px] hover:bg-[#f9f9f9] transition-colors flex items-center gap-[6px]"
                  title="Sign in to save your preferences and track calculations"
                >
                  <User className="w-[14px] h-[14px]" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthView('signup');
                    setShowAuthModal(true);
                  }}
                  className="bg-[#f5f5f5] text-black border border-[#ececec] rounded-[8px] py-[8px] px-[16px] font-['Inter'] font-normal text-[13px] leading-[20px] hover:bg-[#ececec] transition-colors"
                  title="Create an account for free calculations"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex gap-[19px] items-start order-1 sm:order-2">
                <div className="flex flex-col gap-[3px]">
                  <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-black">
                    {userInfo.name}
                  </p>
                  <div className={`inline-flex items-center px-[8px] py-[2px] rounded-[4px] ${
                    userInfo.hasFullAccess 
                      ? 'bg-[#dcfce7] text-[#016630]' 
                      : 'bg-[#ececec] text-black'
                  }`}>
                    <span className="font-['Inter'] font-normal text-[12px] leading-[16px]">
                      {userInfo.hasFullAccess ? 'Full Access' : 'Free mode'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-black border border-[rgba(0,0,0,0.1)] rounded-[8px] py-[9px] px-[16px] h-[38px] font-['Inter'] font-normal text-[13px] leading-[20px] hover:bg-[#f9f9f9] transition-colors flex items-center gap-[6px]"
                  title="Sign out of your account"
                >
                  <LogOut className="w-[14px] h-[14px]" />
                  Logout
                </button>
              </div>
            )}
            
            <div className="flex-1 min-w-[280px] order-2 sm:order-1">
              <h1 className="font-['Inter'] font-medium text-[28px] sm:text-[33px] leading-[1.2] sm:leading-[36px] text-black mb-0">
                BASE_LINE
              </h1>
              <p className="font-['Inter'] font-normal text-[18px] sm:text-[22px] md:text-[26px] leading-[1.3] text-[#878787] mt-[4px]">
                Freelance project pricing calculator
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="w-full">
            <p className="font-['Inter'] font-normal leading-[24px] not-italic text-[#878787] text-[14px] sm:text-[14.75px] w-full max-w-[621px]">
              Baseline is a decision boundary system for freelancers. It sets the minimum defensible price for any project based on scope, timeline, revisions, experience, and capacity.
            </p>
          </div>

          {/* Free mode info banner */}
          {isLoggedIn && userInfo && !userInfo.hasFullAccess && (
            <div className="bg-[#fbfbfb] border border-[rgba(0,0,0,0.1)] rounded-[8px] p-[17px] flex items-center gap-[10px]">
              <Info className="w-[16px] h-[16px] text-black shrink-0" />
              <div className="flex items-center gap-[8px] flex-wrap">
                <p className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
                  You're currently in free mode.
                </p>
                <button 
                  onClick={() => window.open('https://baseline.example.com/buy', '_blank')}
                  className="font-['Inter'] font-medium text-[13px] leading-[20px] text-black underline hover:no-underline"
                >
                  Buy a license
                </button>
                <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">or</span>
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="font-['Inter'] font-medium text-[13px] leading-[20px] text-black underline hover:no-underline"
                >
                  Enter license key
                </button>
                <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">for unlimited access!</span>
                <span className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#b82121]">
                  ({5 - userInfo.calculationsUsed} calculation{5 - userInfo.calculationsUsed === 1 ? '' : 's'} remaining)
                </span>
              </div>
            </div>
          )}

          {/* Not logged in info banner */}
          {!isLoggedIn && (
            <div className="bg-[#eff6ff] relative rounded-[8px] w-full max-w-[621px]">
              <div aria-hidden="true" className="absolute border border-[#bedbff] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[11px] py-[12px] relative w-full">
                <div className="relative shrink-0 size-[16px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <path clipRule="evenodd" d={svgPathsHeader.p134a2680} fill="#155DFC" fillRule="evenodd" />
                  </svg>
                </div>
                <p className="flex-[1_0_0] font-['Inter'] font-normal leading-[0] min-h-px min-w-px not-italic relative text-[#1c398e] text-[12px] whitespace-pre-wrap">
                  <span className="leading-[20px]">You're using preview mode. </span>
                  <button 
                    onClick={() => { setAuthView('signup'); setShowAuthModal(true); }}
                    className="[text-decoration-skip-ink:none] decoration-solid font-['Inter'] font-medium leading-[20px] underline hover:no-underline"
                  >
                    Sign up free
                  </button>
                  <span className="leading-[20px]"> to save your preferences and get 5 more free calculations, or enter a </span>
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="[text-decoration-skip-ink:none] decoration-solid font-['Inter'] font-medium leading-[20px] underline hover:no-underline"
                  >
                    license key
                  </button>
                  <span className="leading-[20px]"> for unlimited access.</span>
                </p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-[18px] flex-wrap">
            {/* Read Instructions Button */}
            <button
              onClick={toggleTutorial}
              className="bg-white h-[44px] content-stretch flex gap-[8px] items-center px-[21px] py-px relative rounded-[8px] shrink-0 hover:bg-gray-50 transition-colors"
            >
              <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <span className="font-['Inter'] font-normal leading-[20px] not-italic text-[14px] text-black">
                Read Instructions
              </span>
              <div className={`relative shrink-0 size-[16px] transition-transform duration-200 ${showTutorial ? 'rotate-180' : ''}`}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <path d="M4 6L8 10L12 6" stroke="#0A0A0A" strokeWidth="1.33333" />
                </svg>
              </div>
            </button>

            {/* Buy License Button */}
            <button
              onClick={() => window.open('https://baseline-pricing.com/license', '_blank')}
              className="bg-[#f5f5f5] content-stretch flex gap-[10px] items-center justify-center px-[24px] py-[12px] relative rounded-[8px] shrink-0 hover:bg-[#ececec] transition-colors"
            >
              <div aria-hidden="true" className="absolute border border-[#ececec] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <div className="relative shrink-0 size-[16px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path d={svgPathsKey.p129aea80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <p className="font-['Inter'] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black text-center">Buy License</p>
            </button>
          </div>
          
          {/* Tutorial Section */}
          <div className={showTutorial ? (tutorialClosing ? 'animate-slide-down' : 'animate-slide-up') : ''}>
            <Tutorial isExpanded={showTutorial} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-[24px] mb-[64px]">
          {/* Left column - Inputs */}
          <div className="flex-1 flex flex-col gap-[24px]">
            {/* Section 1 - Project context */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] border-solid rounded-[14px] p-[24px] flex flex-col gap-[24px]">
              <h2 className="font-['Inter'] font-medium text-[24px] leading-[24px] text-black">
                Project context
              </h2>

              {/* Project Type */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-black flex items-center">
                  Project Type
                  <Tooltip text="Select the primary service type for this project. Different types have different baseline multipliers based on market rates." />
                </label>
                <SegmentedControl
                  options={[
                    { value: 'brand', label: 'Brand' },
                    { value: 'ux-ui', label: 'UX/UI' },
                    { value: 'product', label: 'Product design' },
                    { value: '3d-motion', label: '3D & motion' },
                    { value: 'illustration', label: 'Illustration' },
                    { value: 'strategy', label: 'Strategy & consulting' },
                    { value: 'web-dev', label: 'Web development' }
                  ]}
                  value={projectType}
                  onChange={setProjectType}
                />
              </div>

              {/* Work Size */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-black flex items-center">
                  Work Size
                  <Tooltip text="Estimate the project scope from small (simple deliverables) to extra large (complex, multi-phase projects). Larger projects warrant higher baseline prices." />
                </label>
                <Slider
                  steps={['Small', 'Medium', 'Large', 'Extra']}
                  value={workSize}
                  onChange={setWorkSize}
                />
              </div>

              {/* Timeline Pressure */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-black flex items-center">
                  Timeline Pressure
                  <Tooltip text="How tight is the project deadline? Rushed timelines require higher rates to compensate for the stress and opportunity cost." />
                </label>
                <SegmentedControl
                  options={[
                    { value: 'normal', label: 'Normal', helper: '15–30 days' },
                    { value: 'compressed', label: 'Compressed', helper: '7–14 days' },
                    { value: 'rush', label: 'Rush', helper: '3–6 days' }
                  ]}
                  value={timelinePressure}
                  onChange={setTimelinePressure}
                />
              </div>

              {/* Revisions Model */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-black flex items-center">
                  Revisions Model
                  <Tooltip text="Fixed = limited rounds of revisions. Open = unlimited changes. Open revisions warrant a higher baseline to account for unpredictability." />
                </label>
                <SegmentedControl
                  options={[
                    { value: 'fixed', label: 'Fixed' },
                    { value: 'open', label: 'Open' }
                  ]}
                  value={revisionsModel}
                  onChange={setRevisionsModel}
                />
              </div>
            </div>

            {/* Section 2 - Freelancer context */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] border-solid rounded-[14px] p-[24px] flex flex-col gap-[24px]">
              <h2 className="font-['Inter'] font-medium text-[24px] leading-[24px] text-black">
                Freelancer context
              </h2>

              {/* Experience Band */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-black flex items-center">
                  Experience Band
                  <Tooltip text="Your professional experience level in this field. Senior professionals can command significantly higher baseline rates." />
                </label>
                <SegmentedControl
                  options={[
                    { value: 'junior', label: 'Junior' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'senior', label: 'Senior' }
                  ]}
                  value={experienceBand}
                  onChange={setExperienceBand}
                />
              </div>

              {/* Capacity Pressure */}
              <div className="flex flex-col gap-[12px]">
                <label className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-black flex items-center">
                  Capacity Pressure
                  <Tooltip text="Your current availability to take on new work. When you're at full capacity, you should charge premium rates." />
                </label>
                <Slider
                  steps={['Open', 'Limited', 'Full']}
                  value={capacityPressure}
                  onChange={setCapacityPressure}
                />
              </div>
            </div>

            {/* Section 3 - Advanced Options */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] border-solid rounded-[14px] p-[24px] flex flex-col gap-[24px]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[8px]">
                  <h2 className="font-['Inter'] font-medium text-[16px] leading-[24px] text-black">
                    Advanced options
                  </h2>
                  <Tooltip text="Customize the base price and multipliers to fine-tune your baseline calculation for your specific market and needs." />
                </div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787] hover:text-black transition-colors"
                >
                  {showAdvanced ? 'Hide' : 'Show'}
                </button>
              </div>

              {showAdvanced && (
                <div className="flex flex-col gap-[24px]">
                  {/* Base Price */}
                  <div className="flex flex-col gap-[12px]">
                    <label className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-black flex items-center">
                      Base Price ($)
                      <Tooltip text="The starting price before applying multipliers. Adjust based on your market, location, and minimum project threshold." />
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                      min="0"
                      step="50"
                    />
                  </div>

                  {/* Project Type Multipliers */}
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <h3 className="font-['Inter'] font-medium text-[16px] leading-[20px] text-black">
                        Project Type Multipliers
                      </h3>
                      <Tooltip text="Adjust how much each project type affects the baseline price. Higher values mean higher minimum prices for that type of work." />
                    </div>
                    <div className="grid grid-cols-2 gap-[12px]">
                      {[
                        { key: 'brand', label: 'Brand' },
                        { key: 'uxui', label: 'UX/UI' },
                        { key: 'product', label: 'Product' },
                        { key: '3dMotion', label: '3D & Motion' },
                        { key: 'illustration', label: 'Illustration' },
                        { key: 'strategy', label: 'Strategy' },
                        { key: 'webDev', label: 'Web Dev' }
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col gap-[6px]">
                          <label className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            value={customMultipliers[item.key as keyof typeof customMultipliers]}
                            onChange={(e) => setCustomMultipliers({
                              ...customMultipliers,
                              [item.key]: Number(e.target.value)
                            })}
                            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[6px] px-[10px] py-[6px] font-['Inter'] font-normal text-[13px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                            min="1.0"
                            step="0.05"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Work Size Multipliers */}
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <h3 className="font-['Inter'] font-medium text-[16px] leading-[20px] text-black">
                        Work Size Multipliers
                      </h3>
                      <Tooltip text="Define how project scope affects pricing. Larger projects should have higher multipliers to reflect increased complexity and time investment." />
                    </div>
                    <div className="grid grid-cols-2 gap-[12px]">
                      {[
                        { key: 'sizeSmall', label: 'Small' },
                        { key: 'sizeMedium', label: 'Medium' },
                        { key: 'sizeLarge', label: 'Large' },
                        { key: 'sizeExtra', label: 'Extra' }
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col gap-[6px]">
                          <label className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            value={customMultipliers[item.key as keyof typeof customMultipliers]}
                            onChange={(e) => setCustomMultipliers({
                              ...customMultipliers,
                              [item.key]: Number(e.target.value)
                            })}
                            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[6px] px-[10px] py-[6px] font-['Inter'] font-normal text-[13px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                            min="1.0"
                            step="0.05"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Pressure Multipliers */}
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <h3 className="font-['Inter'] font-medium text-[16px] leading-[20px] text-black">
                        Timeline Pressure Multipliers
                      </h3>
                      <Tooltip text="Set premium rates for rushed work. Tight deadlines should command higher prices to compensate for stress and opportunity cost." />
                    </div>
                    <div className="grid grid-cols-2 gap-[12px]">
                      {[
                        { key: 'timelineNormal', label: 'Normal' },
                        { key: 'timelineCompressed', label: 'Compressed' },
                        { key: 'timelineRush', label: 'Rush' }
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col gap-[6px]">
                          <label className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            value={customMultipliers[item.key as keyof typeof customMultipliers]}
                            onChange={(e) => setCustomMultipliers({
                              ...customMultipliers,
                              [item.key]: Number(e.target.value)
                            })}
                            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[6px] px-[10px] py-[6px] font-['Inter'] font-normal text-[13px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                            min="1.0"
                            step="0.05"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revisions Model Multipliers */}
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <h3 className="font-['Inter'] font-medium text-[16px] leading-[20px] text-black">
                        Revisions Model Multipliers
                      </h3>
                      <Tooltip text="Account for revision scope risk. Open-ended revision models should have higher multipliers due to unpredictable time investment." />
                    </div>
                    <div className="grid grid-cols-2 gap-[12px]">
                      {[
                        { key: 'revisionsFixed', label: 'Fixed' },
                        { key: 'revisionsOpen', label: 'Open' }
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col gap-[6px]">
                          <label className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            value={customMultipliers[item.key as keyof typeof customMultipliers]}
                            onChange={(e) => setCustomMultipliers({
                              ...customMultipliers,
                              [item.key]: Number(e.target.value)
                            })}
                            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[6px] px-[10px] py-[6px] font-['Inter'] font-normal text-[13px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                            min="1.0"
                            step="0.05"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Band Multipliers */}
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <h3 className="font-['Inter'] font-medium text-[16px] leading-[20px] text-black">
                        Experience Band Multipliers
                      </h3>
                      <Tooltip text="Reflect your expertise level in pricing. Senior professionals bring more value and should command significantly higher rates." />
                    </div>
                    <div className="grid grid-cols-2 gap-[12px]">
                      {[
                        { key: 'experienceJunior', label: 'Junior' },
                        { key: 'experienceIntermediate', label: 'Intermediate' },
                        { key: 'experienceSenior', label: 'Senior' }
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col gap-[6px]">
                          <label className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            value={customMultipliers[item.key as keyof typeof customMultipliers]}
                            onChange={(e) => setCustomMultipliers({
                              ...customMultipliers,
                              [item.key]: Number(e.target.value)
                            })}
                            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[6px] px-[10px] py-[6px] font-['Inter'] font-normal text-[13px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                            min="1.0"
                            step="0.05"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Capacity Pressure Multipliers */}
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex items-center gap-[8px]">
                      <h3 className="font-['Inter'] font-medium text-[16px] leading-[20px] text-black">
                        Capacity Pressure Multipliers
                      </h3>
                      <Tooltip text="Price based on your availability. When you're at full capacity, charge premium rates to ensure only the most valuable work comes through." />
                    </div>
                    <div className="grid grid-cols-2 gap-[12px]">
                      {[
                        { key: 'capacityOpen', label: 'Open' },
                        { key: 'capacityLimited', label: 'Limited' },
                        { key: 'capacityFull', label: 'Full' }
                      ].map((item) => (
                        <div key={item.key} className="flex flex-col gap-[6px]">
                          <label className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787]">
                            {item.label}
                          </label>
                          <input
                            type="number"
                            value={customMultipliers[item.key as keyof typeof customMultipliers]}
                            onChange={(e) => setCustomMultipliers({
                              ...customMultipliers,
                              [item.key]: Number(e.target.value)
                            })}
                            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[6px] px-[10px] py-[6px] font-['Inter'] font-normal text-[13px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                            min="1.0"
                            step="0.05"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={resetToDefaults}
                    className="bg-white text-black border border-[rgba(0,0,0,0.1)] rounded-[8px] py-[10px] px-[20px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#f9f9f9] transition-colors self-start"
                    title="Reset all multipliers to their default values"
                  >
                    Reset to Defaults
                  </button>

                  {/* Caption */}
                  <p className="font-['Inter'] font-normal text-[12px] leading-[18px] text-[#878787] italic">
                    Adjust these advanced options to refine your baseline calculation. Changing any input here affects the price and breakdown.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Results */}
          <div className="lg:w-[320px]" id="recap-section">
            <div className="lg:sticky lg:top-[24px] flex flex-col gap-[24px]">
              {/* Buttons at top of results panel */}
              <div className="flex flex-col gap-[8px] w-full">
                <div className="flex gap-[9px] w-full">
                  <button
                    onClick={handleGetResults}
                    className="flex-1 bg-[#f5f5f5] text-black border border-[#ececec] rounded-[8px] py-[11px] px-[20px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#ececec] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ececec] focus:ring-offset-2"
                    title="Calculate your baseline price based on current inputs"
                  >
                    Get Results
                  </button>
                  <button
                    onClick={resetAll}
                    className="flex-1 bg-white text-black border border-[rgba(0,0,0,0.1)] rounded-[8px] py-[11px] px-[21px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#f9f9f9] transition-colors flex items-center justify-center gap-[8px]"
                    title="Reset all inputs to default values"
                  >
                    <RotateCcw className="w-[16px] h-[16px]" />
                    Reset All
                  </button>
                </div>
              </div>

              {/* Baseline Price Card */}
              <div className="bg-white border border-[rgba(0,0,0,0.1)] border-solid rounded-[14px] p-[24px] flex flex-col gap-[24px]">
                {/* Title */}
                <h2 className="font-['Inter'] font-medium text-[16px] leading-[24px] text-black">
                  Baseline price
                </h2>

                {showRecap && !inputsChanged && displayedResult ? (
                  <>
                    {/* Summary Text */}
                    <div className="flex flex-col gap-[8px] pb-[16px] border-b border-[rgba(0,0,0,0.1)]">
                      <p className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#0a0a0a]">
                        Your <span className="font-medium">{projectTypeLabels[projectType].toLowerCase()}</span> project ({workSizeLabels[workSize].toLowerCase()}, {timelinePressureLabels[timelinePressure].toLowerCase()} timeline, {revisionsLabels[revisionsModel].toLowerCase()} revisions), handled by a <span className="font-medium">{experienceLabels[experienceBand].toLowerCase()}</span> freelancer with <span className="font-medium">{capacityLabels[capacityPressure].toLowerCase()}</span> availability, has a baseline price of <span className="font-medium">${displayedResult.total.toLocaleString()}</span>. This is the minimum defensible price for this project.
                      </p>
                    </div>

                    {/* Primary value */}
                    <div className="flex flex-col gap-[8px]">
                      <div className="font-['Inter'] font-medium text-[40px] leading-[48px] text-black">
                        ${displayedResult.total.toLocaleString()}
                      </div>
                      <p className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-[#878787]">
                        This is the minimum price under which the project stops being viable.
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="flex flex-col gap-[12px]">
                      <h3 className="font-['Inter'] font-medium text-[14px] leading-[20px] text-black">
                        Breakdown
                      </h3>
                      <div className="flex flex-col gap-[8px]">
                        <div className="flex justify-between items-center">
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            Project type
                          </span>
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            ×{displayedResult.breakdown.projectType.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            Work size
                          </span>
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            ×{displayedResult.breakdown.workSize.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            Timeline pressure
                          </span>
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            ×{displayedResult.breakdown.timelinePressure.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            Revisions model
                          </span>
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            ×{displayedResult.breakdown.revisionsModel.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            Experience band
                          </span>
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            ×{displayedResult.breakdown.experienceBand.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            Capacity pressure
                          </span>
                          <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                            ×{displayedResult.breakdown.capacityPressure.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col gap-[12px] pt-[12px] border-t border-[rgba(0,0,0,0.1)]">
                      <h3 className="font-['Inter'] font-medium text-[14px] leading-[20px] text-black">
                        Summary
                      </h3>
                      <div className="flex flex-col gap-[8px]">
                        <div>
                          <div className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787] mb-[4px]">
                            Project context
                          </div>
                          <div className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
                            {projectTypeLabels[projectType]} · {workSizeLabels[workSize]} · {timelinePressureLabels[timelinePressure]} · {revisionsLabels[revisionsModel]}
                          </div>
                        </div>
                        <div>
                          <div className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787] mb-[4px]">
                            Freelancer context
                          </div>
                          <div className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
                            {experienceLabels[experienceBand]} · {capacityLabels[capacityPressure]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Show warning if inputs changed */}
                    {showRecap && inputsChanged && (
                      <Alert type="warning">
                        <span className="font-medium">Inputs changed.</span> Click "Get Results" to update your baseline.
                      </Alert>
                    )}

                    {/* Placeholder State */}
                    <div className="flex flex-col gap-[24px] opacity-30">
                      <div className="flex flex-col gap-[8px]">
                        <div className="font-['Inter'] font-medium text-[40px] leading-[48px] text-black">
                          $—
                        </div>
                        <p className="font-['Inter'] font-normal text-[13.016px] leading-[20px] text-[#878787]">
                          Click "Get Results" to see your baseline price.
                        </p>
                      </div>

                      {/* Breakdown Placeholder */}
                      <div className="flex flex-col gap-[12px]">
                        <h3 className="font-['Inter'] font-medium text-[14px] leading-[20px] text-black">
                          Breakdown
                        </h3>
                        <div className="flex flex-col gap-[8px]">
                          <div className="flex justify-between items-center">
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              Project type
                            </span>
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              ×—
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              Work size
                            </span>
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              ×—
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              Timeline pressure
                            </span>
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              ×—
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              Revisions model
                            </span>
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              ×—
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              Experience band
                            </span>
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              ×—
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              Capacity pressure
                            </span>
                            <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                              ×—
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary Placeholder */}
                      <div className="flex flex-col gap-[12px] pt-[12px] border-t border-[rgba(0,0,0,0.1)]">
                        <h3 className="font-['Inter'] font-medium text-[14px] leading-[20px] text-black">
                          Summary
                        </h3>
                        <div className="flex flex-col gap-[8px]">
                          <div>
                            <div className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787] mb-[4px]">
                              Project context
                            </div>
                            <div className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
                              — · — · — · —
                            </div>
                          </div>
                          <div>
                            <div className="font-['Inter'] font-normal text-[12px] leading-[16px] text-[#878787] mb-[4px]">
                              Freelancer context
                            </div>
                            <div className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
                              — · —
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer 
          onPrivacyClick={() => setShowPrivacyModal(true)}
          onTermsClick={() => setShowTermsModal(true)}
        />
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center px-[20px] z-50 ${authModalClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeAuthModal}>
          <div className={`bg-white rounded-[14px] p-[32px] max-w-[440px] w-full max-h-[90vh] overflow-y-auto md:overflow-y-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden ${authModalClosing ? 'animate-slide-down' : 'animate-slide-up'} relative`} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeAuthModal}
              className="absolute top-[24px] right-[24px] text-[#878787] hover:text-black transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-[20px] h-[20px]" />
            </button>
            
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Inter'] font-medium text-[28px] leading-[32px] text-black">
                  {authView === 'login' ? 'Welcome back' : authView === 'signup' ? 'Create your account' : 'Reset your password'}
                </h2>
                <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#878787]">
                  {authView === 'login' 
                    ? 'Sign in to access your saved preferences and calculations' 
                    : authView === 'signup'
                    ? 'Get 5 free calculations or enter a license key for unlimited access'
                    : 'Enter your email and we\'ll send you a reset link'}
                </p>
              </div>

              {authView === 'login' ? (
                <LoginForm onLogin={handleLogin} onSwitchToForgot={() => setAuthView('forgot')} loading={authLoading} />
              ) : authView === 'signup' ? (
                <SignupForm onSignup={handleSignup} loading={authLoading} />
              ) : (
                <ForgotPasswordForm onSubmit={handleForgotPassword} loading={authLoading} />
              )}

              <div className="flex items-center gap-[8px] justify-center pt-[8px] border-t border-[rgba(0,0,0,0.1)]">
                <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                  {authView === 'login' ? "Don't have an account?" : authView === 'signup' ? 'Already have an account?' : 'Remember your password?'}
                </span>
                <button
                  onClick={() => setAuthView(authView === 'login' || authView === 'forgot' ? 'signup' : 'login')}
                  className="font-['Inter'] font-medium text-[13px] leading-[20px] text-black hover:underline"
                >
                  {authView === 'login' || authView === 'forgot' ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center px-[20px] z-50 ${upgradeModalClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeUpgradeModal}>
          <div className={`bg-white rounded-[14px] p-[24px] max-w-[400px] w-full ${upgradeModalClosing ? 'animate-slide-down' : 'animate-slide-up'} relative`} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeUpgradeModal}
              className="absolute top-[20px] right-[20px] text-[#878787] hover:text-black transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-[20px] h-[20px]" />
            </button>
            
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <h2 className="font-['Inter'] font-medium text-[24px] leading-[24px] text-black">
                  Upgrade to Full Access
                </h2>
                <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-[#878787]">
                  You've reached the limit of 5 calculations. Enter a license key to unlock unlimited calculations.
                </p>
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
                  License Key
                </label>
                <input
                  type="text"
                  id="upgrade-license-key"
                  className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
                  placeholder="Enter your license key"
                />
                
              </div>

              <div className="flex gap-[12px]">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 bg-white text-black border border-[rgba(0,0,0,0.1)] rounded-[8px] py-[10px] px-[20px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#f9f9f9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('upgrade-license-key') as HTMLInputElement;
                    if (input?.value) {
                      handleUpgrade(input.value);
                    }
                  }}
                  className="flex-1 bg-[#f5f5f5] text-black border border-[#ececec] rounded-[8px] py-[10px] px-[20px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#ececec] transition-colors"
                >
                  Upgrade
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-[12px] items-center pt-[12px] border-t border-[rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-[8px] flex-wrap justify-center">
                  <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                    Don't have a license?
                  </span>
                  <button
                    onClick={() => window.open('https://baseline.example.com/buy', '_blank')}
                    className="font-['Inter'] font-medium text-[13px] leading-[20px] text-black underline hover:no-underline"
                  >
                    Buy a license
                  </button>
                </div>
                
                {!isLoggedIn && (
                  <div className="flex items-center gap-[8px] flex-wrap justify-center">
                    <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                      Already have an account?
                    </span>
                    <button
                      onClick={() => {
                        closeUpgradeModal();
                        setAuthView('login');
                        setShowAuthModal(true);
                      }}
                      className="font-['Inter'] font-medium text-[13px] leading-[20px] text-black underline hover:no-underline"
                    >
                      Sign in
                    </button>
                  </div>
                )}
                
                {!isLoggedIn && (
                  <div className="flex items-center gap-[8px] flex-wrap justify-center">
                    <span className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                      New to Baseline?
                    </span>
                    <button
                      onClick={() => {
                        closeUpgradeModal();
                        setAuthView('signup');
                        setShowAuthModal(true);
                      }}
                      className="font-['Inter'] font-medium text-[13px] leading-[20px] text-black underline hover:no-underline"
                    >
                      Create free account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.2s ease-out;
        }
        
        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .animate-fade-out {
          animation: fade-out 0.2s ease-out;
        }
        
        @keyframes slide-down {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(20px);
            opacity: 0;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
        
        button, a, [role="button"] {
          cursor: pointer;
        }
      `}</style>

      {/* Cookie Consent Banner */}
      <CookieConsent 
        onPrivacyClick={() => setShowPrivacyModal(true)}
        onTermsClick={() => setShowTermsModal(true)}
      />

      {/* Privacy Modal */}
      <PrivacyModal 
        isOpen={showPrivacyModal}
        onClose={closePrivacyModal}
        isClosing={privacyModalClosing}
      />

      {/* Terms Modal */}
      <TermsModal 
        isOpen={showTermsModal}
        onClose={closeTermsModal}
        isClosing={termsModalClosing}
      />
    </div>
    </LanguageProvider>
  );
}

// Login Form Component
function LoginForm({ onLogin, onSwitchToForgot, loading }: { onLogin: (email: string, password: string) => void; onSwitchToForgot: () => void; loading: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[8px]">
        <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] pr-[40px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors w-full"
            placeholder="Enter your password"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#878787] hover:text-black transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
          </button>
        </div>
        <button
          type="button"
          onClick={onSwitchToForgot}
          className="font-['Inter'] font-normal text-[12px] leading-[18px] text-[#878787] hover:text-black text-left"
        >
          Forgot your password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#f5f5f5] text-black border border-[#ececec] rounded-[8px] py-[12px] px-[24px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#ececec] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}

// Signup Form Component
function SignupForm({ onSignup, loading }: { onSignup: (email: string, password: string, name: string, licenseKey: string) => void; loading: boolean }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(email, password, name, licenseKey);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[8px]">
        <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
          placeholder="Your name"
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] pr-[40px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors w-full"
            placeholder="Create a password"
            required
            minLength={6}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#878787] hover:text-black transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-[16px] h-[16px]" /> : <Eye className="w-[16px] h-[16px]" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black flex items-center gap-[6px]">
          License Key (optional)
          <svg className="w-[14px] h-[14px] text-[#878787]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </label>
        <input
          type="text"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
          placeholder="Leave empty for Free Preview"
          disabled={loading}
        />
        <p className="font-['Inter'] font-normal text-[12px] leading-[18px] text-[#878787]">
          Free Preview: 5 calculations. Enter any license key for unlimited access.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#f5f5f5] text-black border border-[#ececec] rounded-[8px] py-[12px] px-[24px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#ececec] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}

// Forgot Password Form Component
function ForgotPasswordForm({ onSubmit, loading }: { onSubmit: (email: string) => void; loading: boolean }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[8px]">
        <label className="font-['Inter'] font-normal text-[13px] leading-[20px] text-black">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[8px] px-[12px] py-[10px] font-['Inter'] font-normal text-[14px] leading-[20px] text-black focus:outline-none focus:border-black transition-colors"
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-[8px] p-[12px]">
        <p className="font-['Inter'] font-normal text-[12px] leading-[18px] text-blue-900">
          <span className="font-medium">Demo mode:</span> Reset link will be simulated
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded-[8px] py-[12px] px-[24px] font-['Inter'] font-normal text-[14px] leading-[20px] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  );
}
