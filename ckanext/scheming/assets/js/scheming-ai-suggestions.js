// /ckanext/scheming/assets/js/scheming-ai-suggestions.js
ckan.module('scheming-ai-suggestions', function($) {
  return {
    initialize: function() {
      console.log("Initializing scheming-ai-suggestions module");
      
      var el = this.el;
      var fieldName = $(el).data('field-name');
      var fieldId = 'field-' + fieldName;
      
      // Create custom popover when clicked
      $(el).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("AI suggestion button clicked for field:", fieldName);
        
        // Hide all other popovers first
        $('.ai-suggestion-popover').hide();
        
        // Get suggestion data
        var suggestionValue = $(el).data('suggestion-value') || '';
        var suggestionSource = $(el).data('suggestion-source') || 'AI Generated';
        
        // Create popover if it doesn't exist yet
        var popoverId = 'ai-suggestion-popover-' + fieldName;
        if ($('#' + popoverId).length === 0) {
          console.log("Creating new popover for field:", fieldName);
          createPopover(fieldName, suggestionValue, suggestionSource, $(el));
        } else {
          // Just show existing popover
          console.log("Showing existing popover for field:", fieldName);
          positionPopover($('#' + popoverId), $(el));
          $('#' + popoverId).show();
        }
      });
    }
  };
});

// Add direct click handling outside of the module
$(document).ready(function() {
  console.log("Document ready - initializing AI suggestions");
  
  // Debug - check if we can find fields with the attribute
  var fieldsWithAI = $('[data-field-supports-ai-suggestion="true"]');
  console.log("Fields with AI support:", fieldsWithAI.length);
  
  // Try a different selector to find eligible fields
  var allFields = $('input[id^="field-"], textarea[id^="field-"]');
  console.log("Total fields found:", allFields.length);
  
  // Manual approach - check each field against a predefined list
  var aiSuggestionFields = ['title', 'notes', 'name', 'description', 'spatial_extent', 'tag_string'];
  
  // Direct click handler for all AI suggestion buttons
  $(document).on('click', '.ai-suggestion-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var $button = $(this);
    var fieldName = $button.data('field-name');
    console.log("AI suggestion button clicked for field:", fieldName);
    
    // Hide all other popovers first
    $('.ai-suggestion-popover').hide();
    
    // Get suggestion data
    var suggestionValue = $button.data('suggestion-value') || '';
    var suggestionSource = $button.data('suggestion-source') || 'AI Generated';
    
    // Create popover if it doesn't exist yet
    var popoverId = 'ai-suggestion-popover-' + fieldName;
    if ($('#' + popoverId).length === 0) {
      console.log("Creating new popover for field:", fieldName);
      createPopover(fieldName, suggestionValue, suggestionSource, $button);
    } else {
      // Just show existing popover
      console.log("Showing existing popover for field:", fieldName);
      positionPopover($('#' + popoverId), $button);
      $('#' + popoverId).show();
    }
  });
  
  // Close popover when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.ai-suggestion-btn').length && 
        !$(e.target).closest('.ai-suggestion-popover').length) {
      $('.ai-suggestion-popover').hide();
    }
  });
  
  // Add AI suggestion buttons to fields if needed
  allFields.each(function() {
    var fieldId = $(this).attr('id');
    if (fieldId) {
      var fieldName = fieldId.replace('field-', '');
      
      if (aiSuggestionFields.indexOf(fieldName) >= 0) {
        console.log("Adding AI suggestion to field:", fieldName);
        
        // Get control group and label
        var $controlGroup = $(this).closest('.control-group');
        var $label = $controlGroup.find('.control-label');
        
        // Find or create the control-label-with-suggestion div
        var $labelWrapper = $label.find('.control-label-with-suggestion');
        if ($labelWrapper.length === 0) {
          $label.wrapInner('<div class="control-label-with-suggestion"></div>');
          $labelWrapper = $label.find('.control-label-with-suggestion');
        }
        
        // Only add if no AI suggestion icon exists yet
        if ($labelWrapper.find('.ai-suggestion-btn').length === 0) {
          // Create suggestion value
          var suggestionValue = generateDummySuggestion(fieldName);
          
          // Create button
          var $button = $('<button type="button" class="ai-suggestion-btn" title="AI Suggestion Available" data-module="scheming-ai-suggestions"></button>');
          $button.attr('data-field-name', fieldName);
          $button.attr('data-suggestion-value', suggestionValue);
          $button.attr('data-suggestion-source', 'AI Generated');
          
          // Add robot icon
          $button.html('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0"><path d="m35.816 21.871c0.81641-0.085938 1.4102-0.82031 1.3281-1.6406-0.085937-0.82031-0.8125-1.418-1.6328-1.3438-4.0469 0.46875-7.8125 2.2891-10.691 5.168-2.8789 2.8789-4.7031 6.6445-5.1719 10.691-1.0234 9.8867-1.0234 19.855 0 29.746 0.47656 4.043 2.2969 7.8047 5.1758 10.684 2.8789 2.875 6.6406 4.6992 10.684 5.1719 4.9414 0.51172 9.9023 0.76953 14.871 0.76562 4.9688 0.003907 9.9336-0.25391 14.875-0.76562 4.0391-0.47656 7.8008-2.3047 10.676-5.1797 2.8789-2.875 4.6992-6.6367 5.1797-10.676 0.085937-0.82422-0.51172-1.5625-1.3359-1.6484-0.82422-0.085938-1.5625 0.51172-1.6484 1.3359-0.39844 3.3594-1.9141 6.4844-4.3047 8.8789-2.3906 2.3906-5.5156 3.9062-8.875 4.3047-9.6836 1.0078-19.449 1.0078-29.133 0-3.3438-0.42578-6.457-1.9531-8.8398-4.3398-2.3867-2.3867-3.9141-5.4961-4.3398-8.8438-1.0039-9.6836-1.0039-19.445 0-29.129 0.42188-3.3477 1.9492-6.4609 4.3359-8.8477 2.3828-2.3867 5.4961-3.9102 8.8477-4.332z"/><path d="m46.148 52.344c0 0.82812 0.67187 1.5 1.5 1.5 6.1953 0 11.23 6.1797 11.23 13.777 0 0.82812 0.67188 1.5 1.5 1.5s1.5-0.67188 1.5-1.5c0-7.5977 5.0391-13.777 11.23-13.777 0.82812 0 1.5-0.67188 1.5-1.5 0-0.83203-0.67188-1.5-1.5-1.5-6.1914 0-11.23-6.1797-11.23-13.777v-0.003906c0-0.82812-0.67188-1.5-1.5-1.5s-1.5 0.67188-1.5 1.5c0 7.5977-5.0352 13.777-11.23 13.777v0.003906c-0.82813 0-1.5 0.66797-1.5 1.5zm14.23-7.7852c1.3359 3.293 3.7539 6.0391 6.8516 7.7852-3.0977 1.7422-5.5156 4.4883-6.8516 7.7812-1.3359-3.293-3.75-6.0391-6.8477-7.7812 3.0977-1.7461 5.5117-4.4922 6.8477-7.7852z"/><path d="m52.609 30.383c-2.543 0-4.6133-2.6211-4.6133-5.8359 0-0.83203-0.67188-1.5-1.5-1.5-0.83203 0-1.5 0.66797-1.5 1.5 0 3.2188-2.0703 5.8359-4.6133 5.8359-0.83203 0-1.5 0.67188-1.5 1.5 0 0.82813 0.66797 1.5 1.5 1.5 2.543 0 4.6133 2.6211 4.6133 5.8398 0 0.82812 0.66797 1.5 1.5 1.5 0.82812 0 1.5-0.67188 1.5-1.5 0-3.2188 2.0703-5.8398 4.6133-5.8398 0.82812 0 1.5-0.67187 1.5-1.5 0-0.82812-0.67188-1.5-1.5-1.5zm-6.1133 3.5781c-0.50391-0.79297-1.1406-1.4961-1.875-2.0781 0.73438-0.58203 1.3711-1.2812 1.875-2.0742 0.5 0.79297 1.1367 1.4922 1.8711 2.0742-0.73438 0.58203-1.3711 1.2852-1.8711 2.0781z"/><path d="m79.617 28.195c-3.4531 0-6.2617-3.5078-6.2617-7.8164v-0.042968c-0.011719-0.82813-0.69531-1.4883-1.5234-1.4766s-1.4883 0.69141-1.4766 1.5195c0 4.3086-2.8086 7.8164-6.2617 7.8164-0.82812 0-1.5 0.67188-1.5 1.5 0 0.82813 0.67188 1.5 1.5 1.5 3.4141 0 6.1953 3.4258 6.2617 7.668v0.14453h0.003906v0.003907c0 0.82812 0.66797 1.5 1.5 1.5 0.82812 0 1.5-0.67188 1.5-1.5 0-4.3086 2.8086-7.8125 6.2617-7.8125l-0.003906-0.003907c0.82812 0 1.5-0.67187 1.5-1.5 0-0.82812-0.67188-1.5-1.5-1.5zm-7.7617 4.9219c-0.74609-1.3594-1.793-2.5312-3.0586-3.4219 1.2656-0.89062 2.3125-2.0625 3.0586-3.418 0.74609 1.3555 1.793 2.5273 3.0586 3.418-1.2656 0.89453-2.3125 2.0625-3.0586 3.418z"/></svg>');
          
          // Add to label
          $labelWrapper.append($button);
          
          // Initialize module
          ckan.module.initializeElement($button[0]);
        }
      }
    }
  });
});

// Function to create popover - moved outside the module
function createPopover(fieldName, suggestionValue, suggestionSource, $button) {
  var $field = $('#field-' + fieldName);
  var isSelect = $field.is('select');
  
  // Create popover HTML
  var $popover = $('<div id="ai-suggestion-popover-' + fieldName + '" class="ai-suggestion-popover custom-suggestion-popover"></div>');
  
  var popoverContent = 
    '<div class="suggestion-popover-content">' +
      '<div class="ai-suggestion-header">' +
        '<strong>AI Suggestion</strong>' +
        '<div class="ai-suggestion-source">' + suggestionSource + '</div>' +
      '</div>' +
      '<div class="suggestion-value">' + (suggestionValue || 'No suggestion available').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
      '<button class="suggestion-apply-btn ai-suggestion-apply-btn" ' +
        'data-target="field-' + fieldName + '" ' +
        'data-value="' + (suggestionValue || '').replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/"/g, "&quot;") + '" ' +
        'data-is-select="' + isSelect + '" ' +
        'data-is-valid="true">' +
        'Apply suggestion' +
      '</button>' +
      '<div class="ai-suggestion-context-section">' +
        '<p class="ai-suggestion-context-label">Need a better suggestion?</p>' +
        '<textarea class="ai-suggestion-context" placeholder="Provide more context to improve the suggestion..."></textarea>' +
        '<button class="ai-suggestion-regenerate-btn">' +
          '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0"><path d="m35.816 21.871c0.81641-0.085938 1.4102-0.82031 1.3281-1.6406-0.085937-0.82031-0.8125-1.418-1.6328-1.3438-4.0469 0.46875-7.8125 2.2891-10.691 5.168-2.8789 2.8789-4.7031 6.6445-5.1719 10.691-1.0234 9.8867-1.0234 19.855 0 29.746 0.47656 4.043 2.2969 7.8047 5.1758 10.684 2.8789 2.875 6.6406 4.6992 10.684 5.1719 4.9414 0.51172 9.9023 0.76953 14.871 0.76562 4.9688 0.003907 9.9336-0.25391 14.875-0.76562 4.0391-0.47656 7.8008-2.3047 10.676-5.1797 2.8789-2.875 4.6992-6.6367 5.1797-10.676 0.085937-0.82422-0.51172-1.5625-1.3359-1.6484-0.82422-0.085938-1.5625 0.51172-1.6484 1.3359-0.39844 3.3594-1.9141 6.4844-4.3047 8.8789-2.3906 2.3906-5.5156 3.9062-8.875 4.3047-9.6836 1.0078-19.449 1.0078-29.133 0-3.3438-0.42578-6.457-1.9531-8.8398-4.3398-2.3867-2.3867-3.9141-5.4961-4.3398-8.8438-1.0039-9.6836-1.0039-19.445 0-29.129 0.42188-3.3477 1.9492-6.4609 4.3359-8.8477 2.3828-2.3867 5.4961-3.9102 8.8477-4.332z"/><path d="m46.148 52.344c0 0.82812 0.67187 1.5 1.5 1.5 6.1953 0 11.23 6.1797 11.23 13.777 0 0.82812 0.67188 1.5 1.5 1.5s1.5-0.67188 1.5-1.5c0-7.5977 5.0391-13.777 11.23-13.777 0.82812 0 1.5-0.67188 1.5-1.5 0-0.83203-0.67188-1.5-1.5-1.5-6.1914 0-11.23-6.1797-11.23-13.777v-0.003906c0-0.82812-0.67188-1.5-1.5-1.5s-1.5 0.67188-1.5 1.5c0 7.5977-5.0352 13.777-11.23 13.777v0.003906c-0.82813 0-1.5 0.66797-1.5 1.5zm14.23-7.7852c1.3359 3.293 3.7539 6.0391 6.8516 7.7852-3.0977 1.7422-5.5156 4.4883-6.8516 7.7812-1.3359-3.293-3.75-6.0391-6.8477-7.7812 3.0977-1.7461 5.5117-4.4922 6.8477-7.7852z"/><path d="m52.609 30.383c-2.543 0-4.6133-2.6211-4.6133-5.8359 0-0.83203-0.67188-1.5-1.5-1.5-0.83203 0-1.5 0.66797-1.5 1.5 0 3.2188-2.0703 5.8359-4.6133 5.8359-0.83203 0-1.5 0.67188-1.5 1.5 0 0.82813 0.66797 1.5 1.5 1.5 2.543 0 4.6133 2.6211 4.6133 5.8398 0 0.82812 0.66797 1.5 1.5 1.5 0.82812 0 1.5-0.67188 1.5-1.5 0-3.2188 2.0703-5.8398 4.6133-5.8398 0.82812 0 1.5-0.67187 1.5-1.5 0-0.82812-0.67188-1.5-1.5-1.5zm-6.1133 3.5781c-0.50391-0.79297-1.1406-1.4961-1.875-2.0781 0.73438-0.58203 1.3711-1.2812 1.875-2.0742 0.5 0.79297 1.1367 1.4922 1.8711 2.0742-0.73438 0.58203-1.3711 1.2852-1.8711 2.0781z"/><path d="m79.617 28.195c-3.4531 0-6.2617-3.5078-6.2617-7.8164v-0.042968c-0.011719-0.82813-0.69531-1.4883-1.5234-1.4766s-1.4883 0.69141-1.4766 1.5195c0 4.3086-2.8086 7.8164-6.2617 7.8164-0.82812 0-1.5 0.67188-1.5 1.5 0 0.82813 0.67188 1.5 1.5 1.5 3.4141 0 6.1953 3.4258 6.2617 7.668v0.14453h0.003906v0.003907c0 0.82812 0.66797 1.5 1.5 1.5 0.82812 0 1.5-0.67188 1.5-1.5 0-4.3086 2.8086-7.8125 6.2617-7.8125l-0.003906-0.003907c0.82812 0 1.5-0.67187 1.5-1.5 0-0.82812-0.67188-1.5-1.5-1.5zm-7.7617 4.9219c-0.74609-1.3594-1.793-2.5312-3.0586-3.4219 1.2656-0.89062 2.3125-2.0625 3.0586-3.418 0.74609 1.3555 1.793 2.5273 3.0586 3.418-1.2656 0.89453-2.3125 2.0625-3.0586 3.418z"/></svg>' +
          '<span>Regenerate</span>' +
        '</button>' +
      '</div>' +
    '</div>';
  
  $popover.html(popoverContent);
  $('body').append($popover);
  
  // Position the popover
  positionPopover($popover, $button);
  
  // Add event handlers
  
  // Apply suggestion button
  $popover.find('.suggestion-apply-btn').on('click', function() {
    console.log("Apply button clicked for field:", fieldName);
    var targetId = $(this).data('target');
    var value = $(this).data('value');
    var $target = $('#' + targetId);
    
    if ($target.length === 0) {
      console.error("Target not found:", targetId);
      return;
    }
    
    console.log("Applying suggestion to field:", targetId);
    
    // Apply the suggestion
    if ($target.is('textarea')) {
      $target.val(value);
      // If it's a markdown editor, also update the preview
      if ($target.hasClass('markdown-editor')) {
        $target.trigger('change');
      }
    } else if ($target.is('input[type="text"]')) {
      $target.val(value);
    } else if ($target.is('select')) {
      $target.val(value);
      $target.trigger('change');
    }
    
    // Add a success class for animation
    $target.addClass('suggestion-applied');
    setTimeout(function() {
      $target.removeClass('suggestion-applied');
    }, 1000);
    
    // Show success message
    showSuccessMessage($target);
    
    // Hide the popover
    $popover.hide();
  });
  
  // Regenerate button
  $popover.find('.ai-suggestion-regenerate-btn').on('click', function() {
    console.log("Regenerate button clicked for field:", fieldName);
    var context = $popover.find('.ai-suggestion-context').val();
    
    // Show regenerating state
    var $btn = $(this);
    var originalText = $btn.find('span').text();
    $btn.addClass('regenerating').prop('disabled', true);
    $btn.find('span').text('Regenerating...');
    
    // In a real implementation, this would call an API
    // For now, we'll simulate with a timeout and dummy response
    setTimeout(function() {
      var newSuggestion = generateDummySuggestion(fieldName, context);
      console.log("Generated new suggestion:", newSuggestion);
      
      // Update the suggestion value in the popover
      $popover.find('.suggestion-value').text(newSuggestion);
      
      // Update the apply button data
      $popover.find('.suggestion-apply-btn').data('value', newSuggestion);
      
      // Reset button state
      $btn.removeClass('regenerating').prop('disabled', false);
      $btn.find('span').text(originalText);
      
      // Clear context
      $popover.find('.ai-suggestion-context').val('');
    }, 1500);
  });
}

// Function to position popover
function positionPopover($popover, $button) {
  var buttonPos = $button.offset();
  var parentWidth = $(window).width();
  var popoverWidth = Math.min(350, parentWidth - 40);
  
  var leftPos = buttonPos.left;
  if (leftPos + popoverWidth > parentWidth - 20) {
    leftPos = Math.max(20, parentWidth - popoverWidth - 20);
  }
  
  $popover.css({
    position: 'absolute',
    top: buttonPos.top + $button.outerHeight() + 10,
    left: leftPos,
    maxWidth: popoverWidth + 'px',
    zIndex: 1000,
    display: 'block'
  });
}

// Function to show success message
function showSuccessMessage($target) {
  var $successMsg = $('<div class="suggestion-success-message">Suggestion applied!</div>');
  $successMsg.css({
    position: 'absolute',
    top: $target.offset().top - 25,
    left: $target.offset().left + $target.outerWidth() / 2,
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(42, 145, 52, 0.9)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 1010,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  });
  $('body').append($successMsg);
  
  setTimeout(function() {
    $successMsg.css('opacity', '1');
  }, 10);
  
  setTimeout(function() {
    $successMsg.css('opacity', '0');
    setTimeout(function() {
      $successMsg.remove();
    }, 300);
  }, 1500);
}

// Generate dummy suggestion for a field based on context
function generateDummySuggestion(fieldName, context) {
  // If context is provided, use it to influence the suggestion
  var contextPrefix = context ? "Based on your input: " : "";
  
  switch(fieldName) {
    case 'title':
      return contextPrefix + "AI-Generated Dataset Title" + (context ? " - " + context.substring(0, 20) : "");
    case 'notes':
      return contextPrefix + "This dataset contains various metrics and measurements collected from multiple sources." + 
             (context ? "\n\nAdditional information: " + context : "");
    case 'tag_string':
      return "ai, data, " + (context ? context.toLowerCase().split(" ").slice(0, 3).join(", ") : "analytics");
    case 'spatial_extent':
      return "POLYGON((-122.4194 37.7749, -122.4194 37.8049, -122.3894 37.8049, -122.3894 37.7749, -122.4194 37.7749))";
    case 'name':
      return contextPrefix + "Resource " + (context ? context.substring(0, 15) : "Data File");
    case 'description':
      return contextPrefix + "This resource contains tabular data with multiple columns including date, location and measurements." +
             (context ? "\n\nAs requested: " + context : "");
    default:
      return contextPrefix + "AI-Generated suggestion for " + fieldName + (context ? " - " + context : "");
  }
}