/**
 * Fetches HTML content from a URL and passes it to a callback function
 * @param {string} url - The URL to fetch content from
 * @param {Function} callback - Function to handle the fetched content
 * @param {boolean} isHeader - Flag to indicate if this is header content
 */
async function getData(url, callback, isHeader) {
  try {
    const response = await axios.get(url);
    const htmlData = response.data;
    callback(htmlData, isHeader);
  } catch (error) {
    console.error(error.message);
  }
}

/**
 * Inserts HTML content into header or footer and initializes related functionality
 * @param {string} html - The HTML content to insert
 * @param {boolean} header - Whether to treat this as header (true) or footer (false)
 */
function loadHeaderAndFooter(html, header = true) {

  if (header) {
    $("#navbar").html(html);
    initializeMobileMenu();
  } else {
    $("#footer").html(html);
  }
}

/**
 * Initializes mobile menu functionality
 */
function initializeMobileMenu() {
  // Wait for the navbar content to be fully processed in the DOM
  setTimeout(() => {
    // Get necessary elements
    const mobileMenuButton = document.querySelector('button[aria-controls="mobile-menu"]');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) {
      console.error('Mobile menu elements not found');
      return;
    }
    
    const openIcon = mobileMenuButton.querySelector('.block');
    const closeIcon = mobileMenuButton.querySelector('.hidden');

    // Add ID to the button for easier reference if needed
    mobileMenuButton.id = 'mobile-menu-button';

    // Update mobile menu styles to position it as an overlay
    mobileMenu.classList.add(
      'absolute',        // Position absolutely
      'w-full',          // Full width
      'left-0',          // Align to left
      'z-40',            // Lower than navbar but above content
      'bg-gray-800',     // Background color
      'shadow-lg',       // Add shadow for depth
      'transition-all',  // Enable transitions
      'duration-300',    // Animation duration
      'ease-in-out',     // Animation timing function
      'transform',       // Enable transforms
      'opacity-0',       // Start hidden (opacity)
      'scale-y-0',       // Start hidden (scale)
      'origin-top'       // Scale from top
    );

    // Function to toggle menu visibility
    function toggleMenu() {
      if (mobileMenu.classList.contains('hidden')) {
        // Show menu with animation
        mobileMenu.classList.remove('hidden');

        // Use setTimeout to ensure the transition happens after display is set
        setTimeout(() => {
          mobileMenu.classList.remove('scale-y-0', 'opacity-0');
          mobileMenu.classList.add('scale-y-100', 'opacity-100');
        }, 10);

        // Toggle icons
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');

        // Update aria-expanded attribute
        mobileMenuButton.setAttribute('aria-expanded', 'true');
      } else {
        // Hide menu with animation
        mobileMenu.classList.add('scale-y-0', 'opacity-0');
        mobileMenu.classList.remove('scale-y-100', 'opacity-100');

        // Complete hiding after animation finishes
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300); // Match with transition duration

        // Toggle icons
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');

        // Update aria-expanded attribute
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    }

    // Event listeners
    mobileMenuButton.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      if (!mobileMenu.classList.contains('hidden') &&
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target)) {
        toggleMenu();
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        toggleMenu();
      }
    });
  }, 400); // Small delay to ensure DOM is updated
}

// When document is ready, load header and footer
$(document).ready(function() {
  // Load the navbar first
  getData("navbar.html", loadHeaderAndFooter, true)
    .catch(error => {
      console.error("Error in loading content:", error);
    });
     getData("footer.html", loadHeaderAndFooter, false)
    .catch(error => {
      console.error("Error in loading content:", error);
    });
});