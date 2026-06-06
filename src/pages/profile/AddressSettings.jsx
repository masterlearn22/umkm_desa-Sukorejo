import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfileData } from '../../services/api';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';

const AddressSettings = () => {
  const { user, updateProfile } = useAuth();
  
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
    }
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&limit=5`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setAddress(suggestion.display_name);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung fitur lokasi (GPS).');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 1. Coba menggunakan Photon (Komoot) yang gratis & tidak ada blokir CORS yang ketat
          const response = await fetch(`https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`);
          if (!response.ok) throw new Error('Photon API Failed');
          const data = await response.json();
          
          if (data && data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            const addressParts = [
              props.name,
              props.housenumber ? `${props.street || ''} No. ${props.housenumber}`.trim() : props.street,
              props.district || props.suburb || props.locality,
              props.city || props.county,
              props.state,
              props.postcode
            ].filter(Boolean); // Hapus data yang kosong/undefined
            
            // Hapus duplikat misal name sama dengan street
            const uniqueParts = [...new Set(addressParts)];
            setAddress(uniqueParts.join(', '));
            setSearchQuery('');
          } else {
            throw new Error('No detailed address found in Photon');
          }
        } catch (error) {
          console.error('Photon failed, trying Nominatim...', error);
          // 2. Fallback ke Nominatim (Kadang diblokir di localhost)
          try {
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&email=dev@example.com`);
            if (!nomRes.ok) throw new Error('Nominatim Failed');
            const nomData = await nomRes.json();
            if (nomData && nomData.display_name) {
              setAddress(nomData.display_name);
              setSearchQuery('');
            } else {
              throw new Error('Alamat tidak ditemukan di Nominatim');
            }
          } catch (nomError) {
             console.error('Nominatim failed, trying BigDataCloud...', nomError);
             // 3. Fallback terakhir ke BigDataCloud (Hanya level kecamatan/kota)
             try {
               const fallbackRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
               if (!fallbackRes.ok) throw new Error(`HTTP Error ${fallbackRes.status}`);
               const fallbackData = await fallbackRes.json();
               if (fallbackData && (fallbackData.locality || fallbackData.city)) {
                  const parts = [fallbackData.locality, fallbackData.city, fallbackData.principalSubdivision, fallbackData.countryName].filter(Boolean);
                  const uniqueParts = [...new Set(parts)];
                  setAddress(uniqueParts.join(', '));
                  setSearchQuery('');
               } else {
                  alert('Tidak dapat mendeteksi alamat dari lokasi saat ini.');
               }
            } catch (fallbackErr) {
               console.error('Fallback error:', fallbackErr);
               alert(`Gagal mengambil data alamat: ${error.message}`);
            }
          }
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        console.error('Geolocation error:', error);
        alert('Gagal mengambil koordinat lokasi. Pastikan GPS aktif dan browser diizinkan mengakses lokasi.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Alamat tidak boleh kosong.');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await updateProfileData({
        email: user.email,
        address: address
      });

      if (response.status === 'success') {
        updateProfile({ address: address });
        alert('Alamat berhasil diperbarui dan disimpan!');
      } else {
        alert(response.message || 'Gagal menyimpan alamat ke database.');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Terjadi kesalahan saat menyimpan alamat.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="border-b border-stone-200 pb-4 mb-6">
        <h2 className="text-lg font-medium text-stone-900">Alamat Saya</h2>
        <p className="text-sm text-stone-500">Kelola informasi alamat pengiriman Anda</p>
      </div>

      <div className="max-w-2xl space-y-6">
        
        {/* Autocomplete Search Bar */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm text-stone-700 font-medium mb-2">Cari Lokasi Otomatis</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-stone-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all text-sm"
              placeholder="Ketik nama jalan, desa, atau kecamatan..."
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Loader2 size={16} className="text-stone-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-stone-200 shadow-lg rounded-xl mt-1 max-h-60 overflow-y-auto custom-scrollbar">
              {suggestions.map((suggestion) => (
                <li 
                  key={suggestion.place_id}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-3 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-b-0 flex items-start gap-3 transition-colors"
                >
                  <MapPin size={16} className="text-stone-400 mt-1 shrink-0" />
                  <span className="text-sm text-stone-700 leading-tight">{suggestion.display_name}</span>
                </li>
              ))}
            </ul>
          )}
          
          {showDropdown && searchQuery.length >= 3 && suggestions.length === 0 && !isSearching && (
            <div className="absolute z-10 w-full bg-white border border-stone-200 shadow-lg rounded-xl mt-1 px-4 py-3 text-sm text-stone-500">
              Lokasi tidak ditemukan. Coba kata kunci lain atau isi manual di bawah.
            </div>
          )}

          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
            {isLocating ? 'Mendeteksi Lokasi...' : 'Gunakan Lokasi Saat Ini (GPS)'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm text-stone-700 font-medium mb-2">Alamat Lengkap</label>
            <textarea
              required
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900 resize-none text-sm"
              placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Desa Sukorejo..."
            ></textarea>
            <p className="text-xs text-stone-500 mt-2">
              Anda bisa mencari lokasi di atas lalu melengkapinya dengan detail seperti nomor rumah atau patokan.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Alamat'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressSettings;
