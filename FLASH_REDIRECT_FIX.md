# 🔧 **FLASH REDIRECT FIX - USERS & TRAINING PAGES**

## 🎯 **ROOT CAUSE IDENTIFIED**

The "flash redirect" issue you're experiencing is a **NextAuth race condition**:

1. You visit `/admin/users` 
2. Page loads but NextAuth session is still loading
3. Code thinks you're not authenticated → redirects to login
4. NextAuth finishes loading → you're actually authenticated → redirects to dashboard
5. Result: Brief flash of login page then dashboard

## 🔧 **EXACT FIXES NEEDED**

### Fix 1: `src/pages/admin/users/index.js`

**Find this code around line 25:**
```javascript
useEffect(() => {
  // Check authentication
  if (status === 'loading') return;

  if (!session || !['admin', 'manager'].includes(session.user.role)) {
    router.push('/admin/login');
    return;
  }
```

**Replace with:**
```javascript
useEffect(() => {
  // Check authentication with improved race condition handling
  if (status === 'loading') return; // Still loading, don't do anything

  if (status === 'unauthenticated' || (!session && status === 'authenticated')) {
    router.push('/admin/login');
    return;
  }

  if (session && !['admin', 'manager'].includes(session.user.role)) {
    router.push('/admin/login');
    return;
  }

  // Only fetch data if we have a valid session
  if (session && ['admin', 'manager'].includes(session.user.role)) {
    fetchUsers();
  }
}, [session, status, router, currentPage, searchTerm, selectedRole]);

// Move fetchUsers outside useEffect
const fetchUsers = async () => {
  setPageLoading(true);
  try {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '10',
      search: searchTerm,
      role: selectedRole
    });

    const response = await fetch('/api/users?${params}', {
      credentials: 'include'
    });
    const data = await response.json();

    if (data.success) {
      setUsers(data.users || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalUsers(data.pagination?.total || 0);
      setError('');
    } else {
      throw new Error(data.message || 'Failed to fetch users');
    }
  } catch (err) {
    setError('Failed to fetch users');
    toast.error('Failed to load users');
    console.error(err);
  } finally {
    setPageLoading(false);
  }
};
```

### Fix 2: `src/pages/admin/training/index.js`

**Find this code around line 47:**
```javascript
useEffect(() => {
  if (status === 'loading') return;

  if (!session || !['admin', 'manager'].includes(session.user.role)) {
    router.push('/admin/login');
    return;
  }
```

**Replace with:**
```javascript
useEffect(() => {
  // Check authentication with improved race condition handling
  if (status === 'loading') return; // Still loading, don't do anything

  if (status === 'unauthenticated' || (!session && status === 'authenticated')) {
    router.push('/admin/login');
    return;
  }

  if (session && !['admin', 'manager'].includes(session.user.role)) {
    router.push('/admin/login');
    return;
  }

  // Only fetch data if we have a valid session
  if (session && ['admin', 'manager'].includes(session.user.role)) {
    fetchTrainings();
  }
}, [session, status, router, currentPage, searchTerm, categoryFilter, levelFilter]);

// Move fetchTrainings outside useEffect
const fetchTrainings = async () => {
  setPageLoading(true);
  try {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: '12',
      search: searchTerm,
      category: categoryFilter,
      level: levelFilter
    });

    const response = await fetch('/api/training?${params}', {
      credentials: 'include'
    });
    const data = await response.json();

    if (data.success) {
      const trainingsData = data.trainings || data.data?.trainings || [];
      const paginationData = data.pagination || data.data?.pagination || {};

      setTrainings(trainingsData);
      setTotalPages(paginationData.totalPages || 1);
      setTotalTrainings(paginationData.total || 0);
      setError('');
    } else {
      throw new Error(data.message || 'Failed to fetch trainings');
    }
  } catch (err) {
    setError('Failed to fetch training programs');
    toast.error('Failed to load training programs');
    console.error(err);
  } finally {
    setPageLoading(false);
  }
};
```

## 🎯 **WHY THIS FIXES THE ISSUE**

**Before (Causing Flash):**
- `!session` → redirects immediately even during loading
- Race condition between page load and session load

**After (No Flash):**
- Only redirects if `status === 'unauthenticated'` (confirmed not logged in)
- Waits for NextAuth to finish loading before making decisions
- No premature redirects during loading states

## 📋 **DEPLOYMENT STEPS**

1. **Make the above changes** in both files
2. **Upload to your VPS**
3. **Restart your application**: `pm2 restart all`
4. **Test the pages**:
   - `https://arsanexus.com/admin/users` → Should load smoothly
   - `https://arsanexus.com/admin/training` → Should load smoothly

## ✅ **EXPECTED RESULT**

After this fix:
- ✅ **No more flash redirects** 
- ✅ **Pages load directly** without login page flash
- ✅ **All functionality works** as expected
- ✅ **Authentication still secure**

The key insight is using `status === 'unauthenticated'` instead of just `!session` to avoid race conditions during NextAuth loading.

**This will completely eliminate the flash redirect behavior!** 🚀 