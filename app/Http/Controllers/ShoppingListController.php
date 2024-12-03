<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShoppingListController extends Controller
{
  public function index()
  {
    if (!Auth::check()) return ["status" => 400, "msg" => "Must be logged in application to make this request"];

    // Variables
    $userData = auth()->user();
    $email = $userData->email;

    // Get user lists
    $ownLists = ShoppingList::select('uuid', 'email', 'list_data')
      ->where('email', '=', $email)
      ->get();
    $sharedLists = ShoppingList::select('uuid', 'email', 'list_data')
      ->where('list_data', 'LIKE', '%' . $email . '%')
      ->get();

    // Generate response
    $response = [
      'status' => 200,
      'msg' => 'Ok, retrieving associated lists',
      'lists' => [
        'ownLists' => [],
        'sharedLists' => []
      ]
    ];

    foreach ($ownLists as $list) {
      $listUUID = $list->uuid;
      $response['lists']['ownLists'][$listUUID] = json_decode($list->list_data);
    }

    foreach ($sharedLists as $list) {
      $listUUID = $list->uuid;
      $response['lists']['sharedLists'][$listUUID] = json_decode($list->list_data);
    }

    return $response;
  }

  public function update(Request $request)
  {
    $postData = $request->post();
    if (!isset($postData["data"])) return [
      "status" => 400,
      "msg" => "No shopping list data received"
    ];

    // Variables
    $userData = auth()->user();
    $email = $userData->email;

    // Recover received data
    $data = json_decode($postData["data"], true);
    $dataOwnListUUIDs = array_keys($data["ownLists"]);
    $dataSharedListUUIDs = array_keys($data["sharedLists"]);

    // Delete all unused lists
    ShoppingList::where('email', '=', $email)
      ->whereNotIn('uuid', $dataOwnListUUIDs)->delete();

    // Update existent data
    foreach ($dataOwnListUUIDs as $uuid) {
      /** 
       * 'categories' must be an object, when backend receives an empty object {}, json_encode parses the empty object
       * to an empty array [].
       * 
       * With '(object)[]' what we do is specify to PHP that this array is an Object and json_encode does not make this
       * strange parsing.
       */
      if (gettype($data["ownLists"][$uuid]["categories"]) == "array" && count($data["ownLists"][$uuid]["categories"]) == 0) {
        $data["ownLists"][$uuid]["categories"] = (object)[];
      }

      // Parse empty category items to an object
      $categoryIds = (gettype($data["ownLists"][$uuid]["categories"]) == "array") 
        ? array_keys($data["ownLists"][$uuid]["categories"])
        : [];

      foreach ($categoryIds as $categoryId) {
        if (gettype($data["ownLists"][$uuid]["categories"][$categoryId]["items"]) == "array" && count($data["ownLists"][$uuid]["categories"][$categoryId]["items"]) == 0) {
          $data["ownLists"][$uuid]["categories"][$categoryId]["items"] = (object)[];
        }
      }

      ShoppingList::updateOrCreate(
        ['uuid' => $uuid, 'email' => $email],
        ['list_data' => json_encode($data["ownLists"][$uuid])]
      );
    }

    foreach ($dataSharedListUUIDs as $uuid) {
      if (gettype($data["sharedLists"][$uuid]["categories"]) == "array" && count($data["sharedLists"][$uuid]["categories"]) == 0) {
        $data["sharedLists"][$uuid]["categories"] = (object)[];
      }

      // Parse empty category items to an object
      $categoryIds = (gettype($data["sharedLists"][$uuid]["categories"]) == "array") 
        ? array_keys($data["sharedLists"][$uuid]["categories"])
        : [];

      foreach ($categoryIds as $categoryId) {
        if (gettype($data["sharedLists"][$uuid]["categories"][$categoryId]["items"]) == "array" && count($data["sharedLists"][$uuid]["categories"][$categoryId]["items"]) == 0) {
          $data["sharedLists"][$uuid]["categories"][$categoryId]["items"] = (object)[];
        }
      }

      ShoppingList::where('uuid', '=', $uuid)
        ->update(['list_data' => json_encode($data["sharedLists"][$uuid])]);
    }

    return [
      "status" => 200,
      "msg" => "Data successfully updated"
    ];
  }
}
